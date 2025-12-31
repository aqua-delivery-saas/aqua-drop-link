import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { RefreshCw, Calendar, X, Plus, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UserMenu } from "@/components/customer/UserMenu";

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
        .select(`
          *,
          order_items (*),
          distributors:distributor_id (slug, name)
        `)
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
    onError: () => {
      toast.error("Erro ao cancelar pedido");
    },
  });

  const scheduledOrders = orders.filter(o => o.order_type === 'scheduled' && o.status !== 'cancelado' && o.status !== 'concluido');
  const completedOrders = orders.filter(o => o.status === 'concluido');

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      novo: 'Novo',
      em_entrega: 'Em Entrega',
      concluido: 'Entregue',
      cancelado: 'Cancelado',
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string) => {
    if (status === 'concluido') return 'outline';
    if (status === 'cancelado') return 'destructive';
    return 'default';
  };

  const formatOrderDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });
  };

  const getOrderProductSummary = (order: typeof orders[0]) => {
    if (!order.order_items || order.order_items.length === 0) {
      return 'Pedido';
    }
    const firstItem = order.order_items[0];
    const otherItemsCount = order.order_items.length - 1;
    return otherItemsCount > 0 
      ? `${firstItem.product_name} +${otherItemsCount}` 
      : firstItem.product_name;
  };

  const getTotalQuantity = (order: typeof orders[0]) => {
    return order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  const handleCancelSchedule = (orderId: string) => {
    cancelOrderMutation.mutate(orderId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Faça login para ver seus pedidos.</p>
            <Button onClick={() => navigate("/customer/login")}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRepeatOrder = (order: typeof orders[0]) => {
    const distributor = order.distributors as { slug: string; name: string } | null;
    if (!distributor?.slug) {
      toast.error("Distribuidora não encontrada");
      return;
    }

    const repeatData = {
      repeatItems: order.order_items?.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
      })) || [],
      repeatAddress: order.delivery_street,
      repeatPaymentMethod: order.payment_method,
    };

    navigate(`/order/${distributor.slug}`, { state: repeatData });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          <UserMenu />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
            <p className="text-muted-foreground">Histórico completo de seus pedidos</p>
          </div>
          <Button onClick={() => navigate("/")} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Novo Pedido
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="scheduled" className="relative">
                Agendados
                {scheduledOrders.length > 0 && (
                  <Badge className="ml-2 bg-primary text-primary-foreground h-5 min-w-5 flex items-center justify-center">
                    {scheduledOrders.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed">Entregues</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <Card key={order.id} className="hover-lift animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            {getOrderProductSummary(order)}
                            {order.order_type === 'scheduled' && <Calendar className="h-4 w-4 text-primary" />}
                          </CardTitle>
                          <CardDescription>
                            Pedido #{order.order_number} • {formatOrderDate(order.created_at)} • Qtd: {getTotalQuantity(order)}
                            {order.scheduled_date && (
                              <span className="block mt-1 text-primary">
                                Agendado: {formatOrderDate(order.scheduled_date)}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-muted-foreground">Total: </span>
                          <span className="text-xl font-bold text-primary">
                            R$ {Number(order.total).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          {order.status !== 'cancelado' && (
                            <Button 
                              variant="secondary" 
                              onClick={() => handleRepeatOrder(order)}
                              className="flex-1 sm:flex-initial touch-input"
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Repetir
                            </Button>
                          )}
                          {order.order_type === 'scheduled' && order.status === 'novo' && (
                            <Button 
                              variant="outline" 
                              onClick={() => handleCancelSchedule(order.id)} 
                              disabled={cancelOrderMutation.isPending}
                              className="flex-1 sm:flex-initial touch-input"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Você ainda não fez pedidos.</p>
                    <Button onClick={() => navigate("/")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Fazer Primeiro Pedido
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4 mt-6">
              {scheduledOrders.length > 0 ? (
                scheduledOrders.map((order, index) => (
                  <Card key={order.id} className="hover-lift animate-fade-in border-primary/30" style={{ animationDelay: `${index * 50}ms` }}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            {getOrderProductSummary(order)}
                            <Calendar className="h-4 w-4 text-primary" />
                          </CardTitle>
                          <CardDescription>
                            Pedido #{order.order_number} • {formatOrderDate(order.created_at)}
                            {order.scheduled_date && (
                              <span className="block mt-1 text-primary font-medium">
                                📅 Agendado: {formatOrderDate(order.scheduled_date)}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <Badge variant="default">{getStatusLabel(order.status)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-muted-foreground">Qtd: {getTotalQuantity(order)}x • </span>
                          <span className="text-xl font-bold text-primary">
                            R$ {Number(order.total).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button 
                            variant="secondary" 
                            onClick={() => handleRepeatOrder(order)}
                            className="flex-1 sm:flex-initial touch-input"
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Repetir
                          </Button>
                          {order.status === 'novo' && (
                            <Button 
                              variant="outline" 
                              onClick={() => handleCancelSchedule(order.id)} 
                              disabled={cancelOrderMutation.isPending}
                              className="flex-1 sm:flex-initial touch-input"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Nenhum agendamento encontrado.</p>
                    <Button onClick={() => navigate("/")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Agendar Primeira Entrega
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-6">
              {completedOrders.length > 0 ? (
                completedOrders.map((order, index) => (
                  <Card key={order.id} className="hover-lift animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{getOrderProductSummary(order)}</CardTitle>
                          <CardDescription>
                            Pedido #{order.order_number} • {formatOrderDate(order.created_at)} • Qtd: {getTotalQuantity(order)}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{getStatusLabel(order.status)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-muted-foreground">Total: </span>
                          <span className="text-xl font-bold text-primary">
                            R$ {Number(order.total).toFixed(2)}
                          </span>
                        </div>
                        <Button 
                          variant="secondary" 
                          onClick={() => handleRepeatOrder(order)}
                          className="w-full sm:w-auto touch-input"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Repetir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground">Nenhum pedido entregue ainda.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;
