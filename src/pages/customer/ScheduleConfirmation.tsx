import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { CheckCircle2, Calendar, Clock, MapPin, CreditCard, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";

const ScheduleConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Nenhum agendamento encontrado</CardTitle>
            <CardDescription>Faça um agendamento para ver a confirmação.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { 
    product, 
    quantity, 
    address, 
    paymentMethod, 
    subtotal, 
    discount, 
    total, 
    distributor,
    scheduledDate,
    scheduledTime,
    whatsappUrl 
  } = orderData;

  return (
    <>
      <Helmet>
        <title>Agendamento Confirmado - AquaDelivery</title>
        <meta name="description" content="Seu agendamento de água foi confirmado com sucesso" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Logo size="md" />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="shadow-xl border-primary">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-20 w-20 text-primary animate-scale-in" />
              </div>
              <CardTitle className="text-3xl mb-2">Agendamento Confirmado!</CardTitle>
              <CardDescription className="text-base">
                Seu pedido foi agendado com sucesso
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-2">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Bell className="h-5 w-5" />
                  <span>Lembrete Automático</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Você receberá uma notificação 1 hora antes da entrega
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Detalhes do Agendamento</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Data Agendada</p>
                      <p className="font-medium">{scheduledDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Horário</p>
                      <p className="font-medium">{scheduledTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Endereço de Entrega</p>
                      <p className="font-medium">{address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                      <p className="font-medium capitalize">{paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <h3 className="font-semibold text-lg">Resumo do Pedido</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Produto:</span>
                    <span className="font-medium">{product}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantidade:</span>
                    <span className="font-medium">{quantity}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Distribuidora:</span>
                    <span className="font-medium">{distributor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto:</span>
                      <span>-R$ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={() => window.open(whatsappUrl, '_blank')}
                >
                  Confirmar pelo WhatsApp
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => navigate("/customer/history")}
                >
                  Ver Meus Agendamentos
                </Button>

                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/")}
                >
                  Voltar para Home
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <Badge variant="outline" className="text-xs">
                  Agendamento #{Math.floor(Math.random() * 10000)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default ScheduleConfirmation;
