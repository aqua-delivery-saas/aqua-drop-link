import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, AlertCircle, XCircle, Calendar, CreditCard, Check, Sparkles, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSubscriptionPayments } from "@/hooks/useDistributor";
import { useStripeSubscription } from "@/hooks/useStripeSubscription";

export default function Subscription() {
  const [searchParams] = useSearchParams();
  const { subscription: stripeSubscription, isLoading: isLoadingStripe, createCheckout, openCustomerPortal, forceCheckSubscription } = useStripeSubscription();
  const { data: payments = [], isLoading: isLoadingPayments } = useSubscriptionPayments();

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const navigate = useNavigate();

  // Handle success/cancel redirects
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    
    if (success === "true") {
      toast.success("Pagamento realizado com sucesso! Sua assinatura está ativa.");
      forceCheckSubscription();
      navigate("/distributor/subscription", { replace: true });
    } else if (canceled === "true") {
      toast.info("O pagamento foi cancelado.");
      navigate("/distributor/subscription", { replace: true });
    }
  }, [searchParams, forceCheckSubscription, navigate]);

  const subscriptionStatus = stripeSubscription?.status || "none";
  const currentPlan = stripeSubscription?.plan || null;
  const isSubscribed = stripeSubscription?.subscribed || false;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const getStatusBadge = () => {
    switch (subscriptionStatus) {
      case "active":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Ativo</Badge>;
      case "past_due":
        return <Badge className="bg-yellow-500"><AlertCircle className="w-3 h-3 mr-1" /> Pagamento Pendente</Badge>;
      case "canceled":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Cancelado</Badge>;
      case "expired":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Expirado</Badge>;
      case "none":
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" /> Sem Assinatura</Badge>;
      default:
        return <Badge variant="secondary">{subscriptionStatus}</Badge>;
    }
  };

  const getStatusMessage = () => {
    switch (subscriptionStatus) {
      case "active":
        return (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Tudo certo! Sua assinatura está em dia.
            </AlertDescription>
          </Alert>
        );
      case "past_due":
        return (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Pagamento pendente. Atualize seu método de pagamento para manter o acesso.
            </AlertDescription>
          </Alert>
        );
      case "canceled":
        return (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Assinatura cancelada. Assine novamente para continuar usando o sistema.
            </AlertDescription>
          </Alert>
        );
      case "expired":
        return (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Sua assinatura expirou.</strong> Renove agora para continuar usando o sistema e receber pedidos.
            </AlertDescription>
          </Alert>
        );
      case "none":
        return (
          <Alert className="bg-primary/10 border-primary">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              <strong>Configuração concluída!</strong> Agora escolha um plano para ativar sua distribuidora e começar a receber pedidos.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  const handleSubscribe = async (plan: "monthly" | "annual") => {
    try {
      setIsCheckoutLoading(true);
      await createCheckout(plan);
    } catch (error) {
      toast.error("Erro ao iniciar o checkout. Tente novamente.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsPortalLoading(true);
      await openCustomerPortal();
    } catch (error) {
      toast.error("Erro ao abrir o portal de gerenciamento. Tente novamente.");
    } finally {
      setIsPortalLoading(false);
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Confirmado</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoadingStripe) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-16 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Minha Assinatura</h1>
        <p className="text-muted-foreground mt-1">Gerencie seu plano e pagamentos</p>
      </div>

      {/* Status Message */}
      {getStatusMessage()}

      {/* Seção 1 - Assinatura Atual (só mostra se tem assinatura) */}
      {isSubscribed && (
        <Card>
          <CardHeader>
            <CardTitle>Assinatura Atual</CardTitle>
            <CardDescription>Detalhes do seu plano ativo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Plano</p>
                <p className="text-lg font-semibold">
                  {currentPlan === "monthly" ? "Mensal" : "Anual"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="text-lg font-semibold">
                  {currentPlan === "monthly" ? "R$ 34,99/mês" : "R$ 349/ano"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge()}</div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Próxima renovação
                </p>
                <p className="text-lg font-semibold">{formatDate(stripeSubscription?.subscription_end || null)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button onClick={handleManageSubscription} disabled={isPortalLoading} className="gap-2">
                {isPortalLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                Gerenciar assinatura
              </Button>
              <Button variant="outline" onClick={() => setShowHistoryModal(true)}>
                Ver histórico de pagamentos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seção 2 - Planos Disponíveis */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">
            {isSubscribed ? "Alterar plano" : "Escolha seu plano"}
          </h2>
          <p className="text-muted-foreground">
            {isSubscribed 
              ? "Você pode gerenciar ou trocar seu plano a qualquer momento." 
              : "Comece agora e tenha acesso a todas as funcionalidades."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Plano Mensal */}
          <Card className={currentPlan === "monthly" ? "border-primary border-2" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Plano Mensal
                {currentPlan === "monthly" && (
                  <Badge variant="secondary">Plano Atual</Badge>
                )}
              </CardTitle>
              <CardDescription>Renovação automática a cada 30 dias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">R$ 34,99<span className="text-lg text-muted-foreground">/mês</span></p>
              </div>

              <ul className="space-y-2">
                {[
                  "Painel da distribuidora completo",
                  "Página pública de pedidos",
                  "Envio automático via link do WhatsApp",
                  "Cadastro de produtos e preços",
                  "Suporte via WhatsApp"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full gap-2"
                variant={currentPlan === "monthly" ? "secondary" : "default"}
                onClick={() => handleSubscribe("monthly")}
                disabled={currentPlan === "monthly" || isCheckoutLoading}
              >
                {isCheckoutLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : currentPlan === "monthly" ? (
                  "Plano Atual"
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    {isSubscribed ? "Mudar para Mensal" : "Assinar Mensal"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Plano Anual */}
          <Card className={currentPlan === "annual" ? "border-primary border-2" : "border-accent"}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Plano Anual
                {currentPlan === "annual" ? (
                  <Badge variant="secondary">Plano Atual</Badge>
                ) : (
                  <Badge className="bg-accent text-accent-foreground gap-1">
                    <Sparkles className="w-3 h-3" />
                    Mais econômico
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Renove uma vez e use por 12 meses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">R$ 349<span className="text-lg text-muted-foreground">/ano</span></p>
                <p className="text-sm text-green-600 font-medium">Economize R$ 70,88 (2 meses grátis)</p>
              </div>

              <ul className="space-y-2">
                {[
                  "Tudo do plano mensal",
                  "2 meses de bônus gratuitos",
                  "Suporte prioritário"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full gap-2"
                variant={currentPlan === "annual" ? "secondary" : "default"}
                onClick={() => handleSubscribe("annual")}
                disabled={currentPlan === "annual" || isCheckoutLoading}
              >
                {isCheckoutLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : currentPlan === "annual" ? (
                  "Plano Atual"
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    {isSubscribed ? "Mudar para Anual" : "Assinar Anual"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Histórico */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Histórico de Pagamentos</DialogTitle>
            <DialogDescription>
              Veja todos os seus pagamentos realizados
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPayments ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.paid_at || payment.created_at)}</TableCell>
                      <TableCell>{payment.payment_method || "Stripe"}</TableCell>
                      <TableCell className="font-medium">
                        R$ {Number(payment.amount).toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(payment.status)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Nenhum pagamento registrado ainda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
