import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { CheckCircle2, MessageCircle, Package } from "lucide-react";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  if (!orderData) {
    navigate("/");
    return null;
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Acabei de fazer um pedido:\n\n` +
      `Produto: ${orderData.product} × ${orderData.quantity}\n` +
      `Endereço: ${orderData.address}\n` +
      `Pagamento: ${orderData.paymentMethod}\n` +
      `Total: R$ ${orderData.total.toFixed(2)}`
    );
    window.open(`https://wa.me/5511999999999?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-6">
                <CheckCircle2 className="h-16 w-16 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl">Pedido realizado com sucesso!</CardTitle>
            <p className="text-muted-foreground">
              Seu pedido foi enviado para {orderData.distributor}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Resumo do Pedido
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produto:</span>
                  <span className="font-medium">{orderData.product} × {orderData.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Endereço:</span>
                  <span className="font-medium text-right flex-1 ml-4">{orderData.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pagamento:</span>
                  <span className="font-medium">{orderData.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-primary text-xl">
                    R$ {orderData.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={handleWhatsApp} size="lg" className="w-full" variant="secondary">
                <MessageCircle className="mr-2 h-5 w-5" />
                Enviar confirmação no WhatsApp
              </Button>
              <Button onClick={() => navigate(-2)} size="lg" className="w-full" variant="outline">
                Fazer novo pedido
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>A distribuidora entrará em contato em breve para confirmar a entrega.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrderConfirmation;
