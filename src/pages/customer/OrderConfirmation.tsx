import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import {
  CheckCircle2,
  MessageCircle,
  Package,
  MapPin,
  CreditCard,
  ArrowRight,
  Sparkles,
  CalendarDays,
  Copy,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;
  const [pixCopied, setPixCopied] = useState(false);

  useEffect(() => {
    if (!orderData) {
      navigate("/");
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const handleCopyPix = () => {
    if (orderData.pixKey) {
      navigator.clipboard.writeText(orderData.pixKey);
      setPixCopied(true);
      toast.success("Chave PIX copiada!");
      setTimeout(() => setPixCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    // Send confirmation to customer's phone
    const phoneNumber = orderData.customerPhone?.replace(/\D/g, '') || '';
    
    if (!phoneNumber) {
      toast.error("Telefone não disponível para envio");
      return;
    }
    
    // Ensure 55 prefix for Brazil
    const formattedPhone = phoneNumber.startsWith('55') 
      ? phoneNumber 
      : `55${phoneNumber}`;
    
    const message = encodeURIComponent(
      `📦 *Confirmação do Pedido${orderData.orderNumber ? ` #${orderData.orderNumber}` : ""}*\n\n` +
      `📌 *Produto:* ${orderData.product} × ${orderData.quantity}\n` +
      `📍 *Endereço:* ${orderData.address}\n` +
      `💳 *Pagamento:* ${orderData.paymentMethod}\n` +
      `${orderData.discount > 0 ? `🎉 *Desconto:* -R$ ${orderData.discount.toFixed(2)}\n` : ''}` +
      `💰 *Total:* R$ ${orderData.total.toFixed(2)}\n\n` +
      `🏪 *Distribuidora:* ${orderData.distributor}\n\n` +
      `Obrigado pela sua compra! 💧`
    );
    
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
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
        <div className="text-center mb-8 animate-in fade-in duration-700">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative rounded-full bg-gradient-to-br from-primary to-secondary p-4">
              <CheckCircle2 className="h-20 w-20 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Pedido Confirmado!
          </h1>
          <p className="text-lg text-muted-foreground mb-2">Seu pedido foi enviado para {orderData.distributor}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>A distribuidora entrará em contato em breve</span>
          </div>
        </div>

        {/* Order Details Card */}
        <Card className="shadow-2xl border-2 mb-6 animate-in fade-in duration-700 delay-150">
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
                {orderData.discount > 0 && (
                  <div className="flex justify-between items-center text-green-600 mb-2">
                    <span className="font-medium">Desconto aplicado</span>
                    <span className="font-bold">-R$ {orderData.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-primary/10 flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Valor Total</span>
                  <span className="text-3xl font-bold text-primary">R$ {orderData.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Scheduled Info */}
              {orderData.isScheduled && (
                <div className="flex gap-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <CalendarDays className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Agendado para</p>
                    <p className="font-semibold text-foreground">
                      {orderData.scheduledDate}
                      {orderData.scheduledPeriod && ` - ${orderData.scheduledPeriod}`}
                      {orderData.scheduledTime && ` às ${orderData.scheduledTime}`}
                    </p>
                  </div>
                </div>
              )}

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

              {/* PIX Key Section */}
              {orderData.paymentMethod?.toLowerCase().includes('pix') && orderData.pixKey && (
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                        Chave PIX
                      </p>
                      <p className="font-mono text-sm text-green-700 dark:text-green-300 truncate">
                        {orderData.pixKey}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCopyPix}
                      className="shrink-0 border-green-300 hover:bg-green-100 dark:border-green-700 dark:hover:bg-green-900"
                    >
                      {pixCopied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-green-600" />
                      )}
                      <span>{pixCopied ? "Copiado!" : "Copiar"}</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 animate-in fade-in duration-700 delay-300">
          <Button onClick={handleWhatsApp} size="lg" className="w-full text-base group" variant="secondary">
            <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
            Salvar comprovante no WhatsApp
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button onClick={() => navigate(-2)} size="lg" className="w-full text-base" variant="outline">
            Fazer novo pedido
          </Button>

          <Button onClick={() => navigate("/customer/signup")} size="lg" className="w-full text-base" variant="ghost">
            Criar conta para salvar endereços
          </Button>
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-6 bg-card/50 backdrop-blur-sm rounded-lg border text-center animate-in fade-in duration-700 delay-500">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Próximos passos:</span> A distribuidora receberá seu pedido
            e entrará em contato para confirmar o horário de entrega.
          </p>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;