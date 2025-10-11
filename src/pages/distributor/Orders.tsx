import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { ArrowLeft, MessageCircle, Check } from "lucide-react";
import { toast } from "sonner";

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
}

const Orders = () => {
  const navigate = useNavigate();
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
    },
  ]);

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
    toast.success("Pedido marcado como entregue!");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          <Button variant="ghost" onClick={() => navigate("/distributor/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Painel
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pedidos Recebidos</h1>
          <p className="text-muted-foreground">Gerencie todos os pedidos dos seus clientes</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{order.customerName}</CardTitle>
                    <CardDescription className="text-sm">{order.date}</CardDescription>
                  </div>
                  {getStatusBadge(order.status)}
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
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Endereço de Entrega</p>
                    <p className="font-semibold">{order.address}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleWhatsApp(order.phone, order.customerName)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Abrir no WhatsApp
                  </Button>
                  {order.status !== "concluido" && (
                    <Button
                      variant="accent"
                      onClick={() => markAsDelivered(order.id)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Marcar como Entregue
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">Nenhum pedido recebido ainda.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Orders;
