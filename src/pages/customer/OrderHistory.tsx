import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { RefreshCw, ArrowLeft, Calendar, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState } from "react";

interface HistoryOrder {
  id: string;
  product: string;
  quantity: number;
  date: string;
  status: string;
  total: number;
  scheduledDate?: string;
  scheduledTime?: string;
  type: 'immediate' | 'scheduled';
}

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<HistoryOrder[]>([
    {
      id: "1",
      product: "Água Mineral Crystal",
      quantity: 3,
      date: "2025-01-10",
      status: "Entregue",
      total: 25.50,
      type: 'immediate',
    },
    {
      id: "2",
      product: "Água Mineral Indaiá",
      quantity: 2,
      date: "2025-01-05",
      status: "Entregue",
      total: 18.00,
      type: 'immediate',
    },
    {
      id: "3",
      product: "Água Mineral São Lourenço",
      quantity: 5,
      date: "2024-12-28",
      status: "Entregue",
      total: 37.50,
      type: 'immediate',
    },
    {
      id: "4",
      product: "Água Mineral Crystal",
      quantity: 4,
      date: "2025-01-15",
      status: "Agendado",
      total: 34.00,
      scheduledDate: "2025-01-20",
      scheduledTime: "14:00",
      type: 'scheduled',
    },
    {
      id: "5",
      product: "Água Mineral Indaiá",
      quantity: 2,
      date: "2025-01-16",
      status: "Agendado",
      total: 18.00,
      scheduledDate: "2025-01-22",
      scheduledTime: "10:00",
      type: 'scheduled',
    },
  ]);

  const scheduledOrders = orders.filter(o => o.type === 'scheduled');
  const completedOrders = orders.filter(o => o.status === 'Entregue');

  const handleRepeatOrder = (order: HistoryOrder) => {
    toast.success("Pedido copiado!", {
      description: "Revise os dados e confirme seu pedido.",
      action: {
        label: "Ver Pedido",
        onClick: () => navigate("/order/distribuidora-agua-pura"),
      },
      duration: 4000,
    });
    navigate("/order/distribuidora-agua-pura");
  };

  const handleCancelSchedule = (orderId: string) => {
    setOrders(orders.filter(o => o.id !== orderId));
    toast.success("Agendamento cancelado com sucesso");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Pedidos</h1>
          <p className="text-muted-foreground">Histórico completo de seus pedidos</p>
        </div>

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
                          {order.product}
                          {order.type === 'scheduled' && <Calendar className="h-4 w-4 text-primary" />}
                        </CardTitle>
                        <CardDescription>
                          {new Date(order.date).toLocaleDateString("pt-BR")} • Quantidade: {order.quantity}
                          {order.scheduledDate && (
                            <span className="block mt-1 text-primary">
                              Agendado: {order.scheduledDate} às {order.scheduledTime}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <Badge variant={order.status === "Entregue" ? "outline" : "default"}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-muted-foreground">Total: </span>
                        <span className="text-xl font-bold text-primary">
                          R$ {order.total.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        {order.type === 'scheduled' && order.status === 'Agendado' && (
                          <Button 
                            variant="outline" 
                            onClick={() => handleCancelSchedule(order.id)} 
                            className="flex-1 sm:flex-initial touch-input"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                          </Button>
                        )}
                        <Button onClick={() => handleRepeatOrder(order)} className="flex-1 sm:flex-initial touch-input">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Repetir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground mb-4">Você ainda não fez pedidos.</p>
                  <Button onClick={() => navigate("/order/distribuidora-agua-pura")}>
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
                          {order.product}
                          <Calendar className="h-4 w-4 text-primary" />
                        </CardTitle>
                        <CardDescription>
                          Pedido em: {new Date(order.date).toLocaleDateString("pt-BR")}
                          <span className="block mt-1 text-primary font-medium">
                            📅 Agendado: {order.scheduledDate} às {order.scheduledTime}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant="default">{order.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-muted-foreground">Quantidade: {order.quantity}x • </span>
                        <span className="text-xl font-bold text-primary">
                          R$ {order.total.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          onClick={() => handleCancelSchedule(order.id)} 
                          className="flex-1 sm:flex-initial touch-input"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancelar
                        </Button>
                        <Button onClick={() => handleRepeatOrder(order)} className="flex-1 sm:flex-initial touch-input">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Repetir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground mb-4">Nenhum agendamento encontrado.</p>
                  <Button onClick={() => navigate("/order/distribuidora-agua-pura")}>
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
                        <CardTitle className="text-xl">{order.product}</CardTitle>
                        <CardDescription>
                          {new Date(order.date).toLocaleDateString("pt-BR")} • Quantidade: {order.quantity}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-muted-foreground">Total: </span>
                        <span className="text-xl font-bold text-primary">
                          R$ {order.total.toFixed(2)}
                        </span>
                      </div>
                      <Button onClick={() => handleRepeatOrder(order)} className="w-full sm:w-auto touch-input">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Repetir Pedido
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
      </main>
    </div>
  );
};

export default OrderHistory;
