import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Droplets, RefreshCw, Calendar, X, Plus, Loader2, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UserMenu } from "@/components/customer/UserMenu";
import { CustomerBottomNav } from "@/components/customer/CustomerBottomNav";

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['customer-orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('orders')
        .select(`*, order_items (*), distributors:distributor_id (slug, name)`)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelado' })
        .eq('id', orderId)
        .eq('customer_id', user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-orders'] });
      toast.success("Pedido cancelado com sucesso");
    },
    onError: () => toast.error("Erro ao cancelar pedido"),
  });

  const scheduledOrders = orders.filter(o => o.order_type === 'scheduled' && o.status !== 'cancelado' && o.status !== 'concluido');
  const completedOrders = orders.filter(o => o.status === 'concluido');

  const getStatusLabel = (status: string) => ({
    novo: 'Novo', em_entrega: 'Em Entrega', concluido: 'Entregue', cancelado: 'Cancelado',
  } as Record<string, string>)[status] || status;

  const getStatusVariant = (status: string): "default" | "outline" | "destructive" => {
    if (status === 'concluido') return 'outline';
    if (status === 'cancelado') return 'destructive';
    return 'default';
  };

  const formatOrderDate = (dateStr: string) => format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });

  const getOrderProductSummary = (order: typeof orders[0]) => {
    if (!order.order_items || order.order_items.length === 0) return 'Pedido';
    const firstItem = order.order_items[0];
    const otherItemsCount = order.order_items.length - 1;
    return otherItemsCount > 0 ? `${firstItem.product_name} +${otherItemsCount}` : firstItem.product_name;
  };

  const getTotalQuantity = (order: typeof orders[0]) =>
    order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleRepeatOrder = (order: typeof orders[0]) => {
    const distributor = order.distributors as { slug: string; name: string } | null;
    if (!distributor?.slug) return toast.error("Distribuidora não encontrada");
    navigate(`/order/${distributor.slug}`, {
      state: {
        repeatItems: order.order_items?.map(i => ({
          product_id: i.product_id, product_name: i.product_name, quantity: i.quantity,
        })) || [],
        repeatAddress: order.delivery_street,
        repeatPaymentMethod: order.payment_method,
      },
    });
  };

  if (!user) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center px-5">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Faça login para ver seus pedidos.</p>
            <Button onClick={() => navigate("/customer/login")}>Fazer Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderOrderCard = (order: typeof orders[0], index: number, showCancel = false) => (
    <div
      key={order.id}
      className="rounded-xl bg-card p-4 shadow-[var(--shadow-soft)] animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-bold text-primary">{getOrderProductSummary(order)}</p>
            {order.order_type === 'scheduled' && <Calendar className="h-3.5 w-3.5 shrink-0 text-accent" />}
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            #{order.order_number} • {formatOrderDate(order.created_at)} • Qtd {getTotalQuantity(order)}
          </p>
          {order.scheduled_date && (
            <p className="mt-0.5 text-[11px] font-medium text-accent">
              Agendado: {formatOrderDate(order.scheduled_date)}
            </p>
          )}
        </div>
        <Badge variant={getStatusVariant(order.status)} className="shrink-0 text-[10px]">
          {getStatusLabel(order.status)}
        </Badge>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
        <span className="text-base font-bold text-primary">R$ {Number(order.total).toFixed(2)}</span>
        <div className="flex gap-2">
          {order.status !== 'cancelado' && (
            <Button size="sm" variant="secondary" onClick={() => handleRepeatOrder(order)}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />Repetir
            </Button>
          )}
          {showCancel && order.status === 'novo' && (
            <Button size="sm" variant="outline" onClick={() => cancelOrderMutation.mutate(order.id)} disabled={cancelOrderMutation.isPending}>
              <X className="mr-1.5 h-3.5 w-3.5" />Cancelar
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Meus Pedidos - AquaDelivery</title>
      </Helmet>
      <div className="min-h-[100dvh] bg-background pb-mobile-nav">
        {/* Header */}
        <header className="flex items-center justify-between px-5 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/5">
              <Droplets className="h-6 w-6 text-primary" strokeWidth={1.8} />
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg font-extrabold tracking-wide text-primary">AQUA</p>
              <p className="-mt-1 text-[10px] font-semibold tracking-[0.28em] text-accent">DELIVERY</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Notificações"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-[var(--shadow-soft)] transition-transform active:scale-95"
            >
              <Bell className="h-5 w-5 text-primary" strokeWidth={1.8} />
            </button>
            <UserMenu />
          </div>
        </header>

        {/* Hero */}
        <section className="px-5">
          <div
            className="relative overflow-hidden rounded-2xl p-5 shadow-[var(--shadow-elevated)]"
            style={{ background: "var(--gradient-water)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <ClipboardList className="h-5 w-5 text-primary-foreground" strokeWidth={1.8} />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-primary-foreground">Meus Pedidos</h1>
                <p className="text-xs text-primary-foreground/85">Acompanhe seu histórico</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="accent"
              className="mt-4 h-9 rounded-lg"
              onClick={() => navigate("/")}
            >
              <Plus className="mr-1.5 h-4 w-4" />Novo pedido
            </Button>
          </div>
        </section>

        {/* Tabs */}
        <section className="mt-5 px-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-card shadow-[var(--shadow-soft)]">
                <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
                <TabsTrigger value="scheduled" className="text-xs">
                  Agendados
                  {scheduledOrders.length > 0 && (
                    <span className="ml-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-primary">
                      {scheduledOrders.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs">Entregues</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4 space-y-3">
                {orders.length > 0 ? orders.map((o, i) => renderOrderCard(o, i, o.order_type === 'scheduled')) : (
                  <div className="rounded-xl bg-card p-8 text-center shadow-[var(--shadow-soft)]">
                    <p className="mb-4 text-sm text-muted-foreground">Você ainda não fez pedidos.</p>
                    <Button size="sm" onClick={() => navigate("/")}><Plus className="mr-1.5 h-4 w-4" />Fazer primeiro pedido</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="scheduled" className="mt-4 space-y-3">
                {scheduledOrders.length > 0 ? scheduledOrders.map((o, i) => renderOrderCard(o, i, true)) : (
                  <div className="rounded-xl bg-card p-8 text-center shadow-[var(--shadow-soft)]">
                    <p className="text-sm text-muted-foreground">Nenhum agendamento encontrado.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-4 space-y-3">
                {completedOrders.length > 0 ? completedOrders.map((o, i) => renderOrderCard(o, i)) : (
                  <div className="rounded-xl bg-card p-8 text-center shadow-[var(--shadow-soft)]">
                    <p className="text-sm text-muted-foreground">Nenhum pedido entregue ainda.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </section>

        <CustomerBottomNav />
      </div>
    </>
  );
};

export default OrderHistory;
