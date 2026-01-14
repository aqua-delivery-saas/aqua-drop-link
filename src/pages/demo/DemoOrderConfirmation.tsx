import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
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
  Copy,
  Check,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

// Default mock data if none provided
const defaultMockData = {
  orderId: "demo-order-001",
  orderNumber: "2024001234",
  product: "Galão 20L Premium",
  quantity: 3,
  address: "Rua das Flores, 123 - Centro",
  paymentMethod: "pix",
  subtotal: 36.00,
  discount: 1.80,
  total: 34.20,
  distributor: "Distribuidora Exemplo",
  isScheduled: false,
  pixKey: "contato@distribuidoraexemplo.com.br",
  whatsappUrl: "https://wa.me/5511999999999"
};

const DemoOrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state || defaultMockData;
  const [pixCopied, setPixCopied] = useState(false);

  const handleCopyPix = () => {
    if (orderData.pixKey) {
      navigator.clipboard.writeText(orderData.pixKey);
      setPixCopied(true);
      toast.success("Chave PIX copiada!");
      setTimeout(() => setPixCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    if (orderData.whatsappUrl) {
      toast.info("Em produção, isso abriria o WhatsApp da distribuidora");
      // In demo, we don't actually open WhatsApp
    }
  };

  return (
    <>
      <Helmet>
        <title>Demonstração - Confirmação de Pedido</title>
        <meta name="description" content="Demonstração da tela de confirmação de pedido" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Demo Banner */}
      <div className="bg-amber-500 text-amber-950 text-center py-2 px-4 text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <Info className="h-4 w-4" />
          <span>MODO DEMONSTRAÇÃO - Esta é a tela que seu cliente verá após confirmar o pedido</span>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <header className="border-b bg-card/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Logo size="md" />
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              Demo
            </Badge>
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
            <p className="text-lg text-muted-foreground mb-2">Seu pedido foi enviado para {orderData.distributor}</p>
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
                <Badge variant="outline" className="ml-auto bg-amber-100 text-amber-700 border-amber-300 text-xs">
                  Exemplo
                </Badge>
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
                    <p className="font-semibold text-foreground capitalize">{orderData.paymentMethod}</p>
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
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button onClick={handleWhatsApp} size="lg" className="w-full text-base group" variant="secondary">
              <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Enviar confirmação no WhatsApp
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button onClick={() => navigate("/demo/order")} size="lg" className="w-full text-base" variant="outline">
              Voltar para Página de Pedido
            </Button>

            <Button onClick={() => navigate("/distributor/signup")} size="lg" className="w-full text-base" variant="ghost">
              Criar minha distribuidora
            </Button>
          </div>

          {/* Demo Notice */}
          <Card className="mt-8 border-amber-200 bg-amber-50/50 animate-in fade-in duration-700 delay-500">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Modo Demonstração</p>
                  <p className="text-amber-700">
                    Esta é uma prévia da tela de confirmação que seus clientes verão. 
                    Inclui exibição da chave PIX, botão de WhatsApp e resumo completo do pedido.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Footer */}
          <div className="mt-8 p-6 bg-card/50 backdrop-blur-sm rounded-lg border text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Próximos passos:</span> A distribuidora receberá seu pedido
              e entrará em contato para confirmar o horário de entrega.
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default DemoOrderConfirmation;
