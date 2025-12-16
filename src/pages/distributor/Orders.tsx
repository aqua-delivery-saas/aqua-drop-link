import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Check, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Order {
  id: string;
  customerName: string;
  brand: string;
  quantity: number;
  address: string;
  paymentMethod: string;
  status: "novo" | "em-entrega" | "concluido";
  phone: string;
  date: string;
  type: "immediate" | "scheduled";
  scheduledDate?: string;
  scheduledTime?: string;
}

const Orders = () => {
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      customerName: "João Silva",
      brand: "Água Mineral Crystal",
      quantity: 3,
      address: "Rua das Flores, 456 - Centro",
      paymentMethod: "Dinheiro",
      status: "novo",
      phone: "11999998888",
      date: "2025-01-15 10:30",
      type: "immediate",
    },
    {
      id: "2",
      customerName: "Maria Santos",
      brand: "Água Mineral Indaiá",
      quantity: 2,
      address: "Av. Principal, 789 - Jardim",
      paymentMethod: "Pix",
      status: "em-entrega",
      phone: "11988887777",
      date: "2025-01-15 09:15",
      type: "immediate",
    },
    {
      id: "3",
      customerName: "Pedro Oliveira",
      brand: "Água Mineral São Lourenço",
      quantity: 5,
      address: "Rua do Comércio, 321 - Vila Nova",
      paymentMethod: "Cartão na Entrega",
      status: "novo",
      phone: "11977776666",
      date: "2025-01-15 11:45",
      type: "immediate",
    },
    {
      id: "4",
      customerName: "Ana Beatriz",
      brand: "Água Mineral Crystal",
      quantity: 4,
      address: "Rua das Palmeiras, 100 - Centro",
      paymentMethod: "Pix",
      status: "novo",
      phone: "11966665555",
      date: "2025-01-14 16:00",
      type: "scheduled",
      scheduledDate: "2025-01-20",
      scheduledTime: "10:00",
    },
    {
      id: "5",
      customerName: "Carlos Eduardo",
      brand: "Água Mineral Indaiá",
      quantity: 6,
      address: "Av. Brasil, 500 - Jardim América",
      paymentMethod: "Dinheiro",
      status: "novo",
      phone: "11955554444",
      date: "2025-01-13 10:00",
      type: "scheduled",
      scheduledDate: "2025-01-18",
      scheduledTime: "14:00",
    },
    {
      id: "6",
      customerName: "Fernanda Lima",
      brand: "Água Mineral São Lourenço",
      quantity: 3,
      address: "Rua dos Pinheiros, 222 - Vila Nova",
      paymentMethod: "Cartão na Entrega",
      status: "novo",
      phone: "11944443333",
      date: "2025-01-12 09:30",
      type: "scheduled",
      scheduledDate: "2025-01-22",
      scheduledTime: "09:00",
    },
  ]);

  const immediateOrders = useMemo(() => orders.filter(o => o.type === "immediate"), [orders]);
  const scheduledOrders = useMemo(() => orders.filter(o => o.type === "scheduled"), [orders]);
  const scheduledCount = scheduledOrders.filter(o => o.status === "novo").length;

  const getStatusBadge = (status: Order["status"]) => {
    const variants = {
      "novo": "default",
      "em-entrega": "secondary",
      "concluido": "outline",
    } as const;

    const labels = {
      "novo": "Novo",
      "em-entrega": "Em Entrega",
      "concluido": "Concluído",
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const handleWhatsApp = (phone: string, customerName: string) => {
    const message = encodeURIComponent(`Olá ${customerName}, sua entrega está a caminho!`);
    window.open(`https://wa.me/55${phone.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  const markAsDelivered = (id: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: "concluido" as const } : order
    ));
    toast.success("Pedido marcado como entregue!", {
      description: "O cliente foi notificado sobre a entrega.",
      duration: 3000,
    });
  };

  const sortOrders = (orderList: Order[]) => {
    const sorted = [...orderList];
    
    switch (sortBy) {
      case "date-desc":
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "date-asc":
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case "customer-asc":
        return sorted.sort((a, b) => a.customerName.localeCompare(b.customerName));
      case "customer-desc":
        return sorted.sort((a, b) => b.customerName.localeCompare(a.customerName));
      case "status":
        const statusOrder = { "novo": 0, "em-entrega": 1, "concluido": 2 };
        return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
      case "quantity-desc":
        return sorted.sort((a, b) => b.quantity - a.quantity);
      case "quantity-asc":
        return sorted.sort((a, b) => a.quantity - b.quantity);
      case "scheduled-date":
        return sorted.sort((a, b) => {
          const dateA = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
          const dateB = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
          return dateA - dateB;
        });
      default:
        return sorted;
    }
  };

  const renderOrderCard = (order: Order, index: number) => (
    <Card key={order.id} className="hover-lift animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{order.customerName}</CardTitle>
            <CardDescription className="text-sm">{order.date}</CardDescription>
          </div>
          <div className="flex gap-2">
            {order.type === "scheduled" && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <Calendar className="h-3 w-3 mr-1" />
                Agendado
              </Badge>
            )}
            {getStatusBadge(order.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Produto</p>
            <p className="font-semibold">{order.brand} × {order.quantity}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pagamento</p>
            <p className="font-semibold">{order.paymentMethod}</p>
          </div>
          {order.type === "scheduled" && order.scheduledDate && order.scheduledTime && (
            <div className="md:col-span-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    {format(new Date(order.scheduledDate), "dd 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">{order.scheduledTime}</span>
                </div>
              </div>
            </div>
          )}
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Endereço de Entrega</p>
            <p className="font-semibold">{order.address}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="secondary"
            onClick={() => handleWhatsApp(order.phone, order.customerName)}
            className="w-full sm:w-auto touch-input"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Abrir no WhatsApp
          </Button>
          {order.status !== "concluido" && (
            <Button
              onClick={() => markAsDelivered(order.id)}
              className="w-full sm:w-auto touch-input bg-secondary hover:bg-secondary/90"
            >
              <Check className="mr-2 h-4 w-4" />
              Marcar como Entregue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

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
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Data (Mais recentes)</SelectItem>
                  <SelectItem value="date-asc">Data (Mais antigos)</SelectItem>
                  <SelectItem value="customer-asc">Cliente (A-Z)</SelectItem>
                  <SelectItem value="customer-desc">Cliente (Z-A)</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="quantity-desc">Quantidade (Maior)</SelectItem>
                  <SelectItem value="quantity-asc">Quantidade (Menor)</SelectItem>
                  <SelectItem value="scheduled-date">Data Agendada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="immediate" className="w-full">
          <TabsList className="w-full max-w-md mb-6">
            <TabsTrigger value="immediate" className="flex-1">
              Imediatos
              <Badge variant="secondary" className="ml-2">{immediateOrders.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex-1">
              Agendados
              {scheduledCount > 0 && (
                <Badge className="ml-2 bg-primary animate-pulse">{scheduledCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="flex-1">
              Todos
              <Badge variant="secondary" className="ml-2">{orders.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="immediate" className="space-y-4 pb-mobile-nav">
            {sortOrders(immediateOrders).map((order, index) => renderOrderCard(order, index))}
            {immediateOrders.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">Nenhum pedido imediato.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4 pb-mobile-nav">
            {sortOrders(scheduledOrders).map((order, index) => renderOrderCard(order, index))}
            {scheduledOrders.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">Nenhum pedido agendado.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4 pb-mobile-nav">
            {sortOrders(orders).map((order, index) => renderOrderCard(order, index))}
            {orders.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">Nenhum pedido recebido ainda.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Orders;