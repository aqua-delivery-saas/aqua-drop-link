import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface HistoryOrder {
  id: string;
  product: string;
  quantity: number;
  date: string;
  status: string;
  total: number;
}

const OrderHistory = () => {
  const navigate = useNavigate();
  
  const orders: HistoryOrder[] = [
    {
      id: "1",
      product: "Água Mineral Crystal",
      quantity: 3,
      date: "2025-01-10",
      status: "Entregue",
      total: 25.50,
    },
    {
      id: "2",
      product: "Água Mineral Indaiá",
      quantity: 2,
      date: "2025-01-05",
      status: "Entregue",
      total: 18.00,
    },
    {
      id: "3",
      product: "Água Mineral São Lourenço",
      quantity: 5,
      date: "2024-12-28",
      status: "Entregue",
      total: 37.50,
    },
  ];

  const handleRepeatOrder = (order: HistoryOrder) => {
    toast.success("Redirecionando para novo pedido...");
    navigate("/order/distribuidora-agua-pura");
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

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
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
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-muted-foreground">Total: </span>
                    <span className="text-xl font-bold text-primary">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>
                  <Button onClick={() => handleRepeatOrder(order)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Repetir Pedido
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">Você ainda não fez pedidos.</p>
              <Button onClick={() => navigate("/order/distribuidora-agua-pura")}>
                Fazer Primeiro Pedido
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;
