import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { CheckCircle2, MessageCircle, Package, MapPin, CreditCard, ArrowRight, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16 max-w-3xl">
        {/* Success Animation Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative rounded-full bg-gradient-to-br from-primary to-secondary p-4">
              <CheckCircle2 className="h-20 w-20 text-white" strokeWidth={2.5} />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Pedido Confirmado!
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Seu pedido foi enviado para {orderData.distributor}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>A distribuidora entrará em contato em breve</span>
          </div>
        </div>

        {/* Order Details Card */}
        <Card className="shadow-2xl border-2 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <Package className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Detalhes do Pedido</h2>
            </div>

            <div className="space-y-6">
              {/* Product Info */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-5 rounded-xl border border-primary/10">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Produto</p>
                    <p className="text-xl font-bold text-foreground">{orderData.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Quantidade</p>
                    <p className="text-2xl font-bold text-primary">×{orderData.quantity}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-primary/10 flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Valor Total</span>
                  <span className="text-3xl font-bold text-primary">
                    R$ {orderData.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-secondary" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Endereço de Entrega</p>
                  <p className="font-semibold text-foreground">{orderData.address}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Forma de Pagamento</p>
                  <p className="font-semibold text-foreground">{orderData.paymentMethod}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Button 
            onClick={handleWhatsApp} 
            size="lg" 
            className="w-full text-base group"
            variant="secondary"
          >
            <MessageCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Enviar confirmação no WhatsApp
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            onClick={() => navigate(-2)} 
            size="lg" 
            className="w-full text-base"
            variant="outline"
          >
            Fazer novo pedido
          </Button>

          <Button 
            onClick={() => navigate("/customer/signup")} 
            size="lg" 
            className="w-full text-base"
            variant="ghost"
          >
            Criar conta para salvar endereços
          </Button>
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-6 bg-card/50 backdrop-blur-sm rounded-lg border text-center animate-in fade-in duration-700 delay-500">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Próximos passos:</span> A distribuidora receberá seu pedido e entrará em contato para confirmar o horário de entrega.
          </p>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;
