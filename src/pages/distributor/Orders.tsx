import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Check, Calendar, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDistributorOrders, useUpdateOrderStatus } from "@/hooks/useDistributor";
import { Skeleton } from "@/components/ui/skeleton";

type DeliveryPeriod = "manha" | "tarde" | "noite";

const periodLabels: Record<DeliveryPeriod, string> = {
  manha: "Manhã (08:00 - 12:00)",
  tarde: "Tarde (12:00 - 18:00)",
  noite: "Noite (18:00 - 21:00)",
};

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  novo: { label: 'Novo', variant: 'default' },
  em_entrega: { label: 'Em Entrega', variant: 'secondary' },
  concluido: { label: 'Concluído', variant: 'outline' },
  cancelado: { label: 'Cancelado', variant: 'destructive' },
};

const Orders = () => {
  const { data: orders = [], isLoading } = useDistributorOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const [sortBy, setSortBy] = useState<string>("date-desc");

  const immediateOrders = useMemo(() => orders.filter(o => o.order_type === "immediate"), [orders]);
  const scheduledOrders = useMemo(() => orders.filter(o => o.order_type === "scheduled"), [orders]);
  const scheduledCount = scheduledOrders.filter(o => o.status === "novo").length;

  const handleWhatsApp = (phone: string, customerName: string) => {
    const message = encodeURIComponent(`Olá ${customerName}, sua entrega está a caminho!`);
    window.open(`https://wa.me/55${phone.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  const markAsDelivered = async (id: string) => {
    await updateOrderStatus.mutateAsync({ id, status: "concluido" });
    toast.success("Pedido marcado como entregue!");
  };

  const sortOrders = (orderList: typeof orders) => {
    const sorted = [...orderList];
    switch (sortBy) {
      case "date-desc":
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case "date-asc":
        return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case "customer-asc":
        return sorted.sort((a, b) => a.customer_name.localeCompare(b.customer_name));
      case "status":
        const statusOrder = { novo: 0, em_entrega: 1, concluido: 2, cancelado: 3 };
        return sorted.sort((a, b) => (statusOrder[a.status as keyof typeof statusOrder] || 0) - (statusOrder[b.status as keyof typeof statusOrder] || 0));
      default:
        return sorted;
    }
  };

  const renderOrderCard = (order: typeof orders[0], index: number) => (
    <Card key={order.id} className="hover-lift animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{order.customer_name}</CardTitle>
            <CardDescription className="text-sm">
              {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: ptBR })}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {order.order_type === "scheduled" && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <Calendar className="h-3 w-3 mr-1" />
                Agendado
              </Badge>
            )}
            <Badge variant={statusLabels[order.status]?.variant || 'default'}>
              {statusLabels[order.status]?.label || order.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Pedido</p>
            <p className="font-semibold">#{order.order_number}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pagamento</p>
            <p className="font-semibold">{order.payment_method}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-semibold text-primary">R$ {Number(order.total).toFixed(2)}</p>
          </div>
          {order.order_type === "scheduled" && order.scheduled_date && order.delivery_period && (
            <div className="md:col-span-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    {format(new Date(order.scheduled_date), "dd 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">{periodLabels[order.delivery_period as DeliveryPeriod] || order.delivery_period}</span>
                </div>
              </div>
            </div>
          )}
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Endereço de Entrega</p>
            <p className="font-semibold">{order.delivery_street}, {order.delivery_number}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="secondary" onClick={() => handleWhatsApp(order.customer_phone, order.customer_name)} className="w-full sm:w-auto touch-input">
            <MessageCircle className="mr-2 h-4 w-4" />
            Abrir no WhatsApp
          </Button>
          {order.status !== "concluido" && order.status !== "cancelado" && (
            <Button onClick={() => markAsDelivered(order.id)} className="w-full sm:w-auto touch-input bg-secondary hover:bg-secondary/90" disabled={updateOrderStatus.isPending}>
              {updateOrderStatus.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              Marcar como Entregue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Pedidos Recebidos</h1>
              <p className="text-muted-foreground">Gerencie todos os pedidos dos seus clientes</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Data (Mais recentes)</SelectItem>
                  <SelectItem value="date-asc">Data (Mais antigos)</SelectItem>
                  <SelectItem value="customer-asc">Cliente (A-Z)</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-md mb-6">
            <TabsTrigger value="immediate" className="flex-1">Imediatos<Badge variant="secondary" className="ml-2">{immediateOrders.length}</Badge></TabsTrigger>
            <TabsTrigger value="scheduled" className="flex-1">Agendados{scheduledCount > 0 && <Badge className="ml-2 bg-primary animate-pulse">{scheduledCount}</Badge>}</TabsTrigger>
            <TabsTrigger value="all" className="flex-1">Todos<Badge variant="secondary" className="ml-2">{orders.length}</Badge></TabsTrigger>
          </TabsList>
          <TabsContent value="immediate" className="space-y-4 pb-mobile-nav">
            {sortOrders(immediateOrders).map((order, index) => renderOrderCard(order, index))}
            {immediateOrders.length === 0 && <Card className="text-center py-12"><CardContent><p className="text-muted-foreground">Nenhum pedido imediato.</p></CardContent></Card>}
          </TabsContent>
          <TabsContent value="scheduled" className="space-y-4 pb-mobile-nav">
            {sortOrders(scheduledOrders).map((order, index) => renderOrderCard(order, index))}
            {scheduledOrders.length === 0 && <Card className="text-center py-12"><CardContent><p className="text-muted-foreground">Nenhum pedido agendado.</p></CardContent></Card>}
          </TabsContent>
          <TabsContent value="all" className="space-y-4 pb-mobile-nav">
            {sortOrders(orders).map((order, index) => renderOrderCard(order, index))}
            {orders.length === 0 && <Card className="text-center py-12"><CardContent><p className="text-muted-foreground">Nenhum pedido recebido ainda.</p></CardContent></Card>}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Orders;
