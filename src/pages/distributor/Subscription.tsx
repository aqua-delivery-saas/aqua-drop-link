import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, AlertCircle, XCircle, Calendar, CreditCard, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

type SubscriptionStatus = "active" | "pending" | "expired";

interface Payment {
  date: string;
  type: string;
  value: string;
  status: string;
}

export default function Subscription() {
  const [subscriptionStatus] = useState<SubscriptionStatus>("active");
  const [currentPlan, setCurrentPlan] = useState<"monthly" | "annual">("monthly");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual" | null>(null);

  const nextRenewal = "01/11/2025";
  const lastRenewal = "01/10/2025";

  const paymentHistory: Payment[] = [
    { date: "01/09/2025", type: "Mensal", value: "R$ 30,00", status: "Confirmado" },
    { date: "01/08/2025", type: "Mensal", value: "R$ 30,00", status: "Confirmado" },
    { date: "01/07/2025", type: "Mensal", value: "R$ 30,00", status: "Confirmado" },
  ];

  const getStatusBadge = () => {
    switch (subscriptionStatus) {
      case "active":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Ativo</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500"><AlertCircle className="w-3 h-3 mr-1" /> Pendente</Badge>;
      case "expired":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Expirado</Badge>;
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
      case "pending":
        return (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Pagamento pendente. Efetue o pagamento para manter o acesso.
            </AlertDescription>
          </Alert>
        );
      case "expired":
        return (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Assinatura expirada. Renove para continuar usando o sistema.
            </AlertDescription>
          </Alert>
        );
    }
  };

  const handleRenewNow = () => {
    setSelectedPlan(currentPlan);
    setShowPaymentModal(true);
  };

  const handleMigratePlan = (plan: "monthly" | "annual") => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirmed = () => {
    setShowPaymentModal(false);
    toast.success("Pagamento registrado! Sua assinatura será confirmada em até 24h úteis.");
  };

  const getPaymentValue = () => {
    return selectedPlan === "monthly" ? "R$ 30,00" : "R$ 300,00";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Minha Assinatura</h1>
        <p className="text-muted-foreground mt-1">Gerencie seu plano e pagamentos</p>
      </div>

      {/* Seção 1 - Assinatura Atual */}
      <div className="space-y-4">
        {getStatusMessage()}

        <Card>
          <CardHeader>
            <CardTitle>Assinatura Atual</CardTitle>
            <CardDescription>Detalhes do seu plano ativo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Plano</p>
                <p className="text-lg font-semibold">Padrão Aqua Delivery</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="text-lg font-semibold">
                  {currentPlan === "monthly" ? "R$ 30/mês" : "R$ 300/ano"}
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
                <p className="text-lg font-semibold">{nextRenewal}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Data da última renovação</p>
                <p className="text-base">{lastRenewal}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button onClick={handleRenewNow} className="gap-2">
                <CreditCard className="w-4 h-4" />
                Renovar agora
              </Button>
              <Button variant="outline" onClick={() => setShowHistoryModal(true)}>
                Ver histórico de pagamentos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção 2 - Planos Disponíveis */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Escolha seu tipo de assinatura</h2>
          <p className="text-muted-foreground">
            Você pode manter o plano atual ou migrar para o pagamento anual e economizar.
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
                <p className="text-3xl font-bold">R$ 30<span className="text-lg text-muted-foreground">/mês</span></p>
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
                className="w-full"
                variant={currentPlan === "monthly" ? "secondary" : "default"}
                onClick={() => currentPlan !== "monthly" && handleMigratePlan("monthly")}
                disabled={currentPlan === "monthly"}
              >
                {currentPlan === "monthly" ? "Plano Atual" : "Migrar para Mensal"}
              </Button>
            </CardContent>
          </Card>

          {/* Plano Anual */}
          <Card className={currentPlan === "annual" ? "border-primary border-2" : "border-accent"}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Plano Anual
                <Badge className="bg-accent text-accent-foreground gap-1">
                  <Sparkles className="w-3 h-3" />
                  Mais econômico
                </Badge>
              </CardTitle>
              <CardDescription>Renove uma vez e use por 12 meses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">R$ 300<span className="text-lg text-muted-foreground">/ano</span></p>
                <p className="text-sm text-green-600 font-medium">Ganhe 2 meses grátis</p>
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
                className="w-full"
                variant={currentPlan === "annual" ? "secondary" : "default"}
                onClick={() => currentPlan !== "annual" && handleMigratePlan("annual")}
                disabled={currentPlan === "annual"}
              >
                {currentPlan === "annual" ? "Plano Atual" : "Migrar para Anual"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Pagamento */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Instruções de Pagamento</DialogTitle>
            <DialogDescription>
              Para renovar sua assinatura, envie o valor correspondente para o Pix abaixo:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Chave Pix</p>
                <p className="text-lg font-mono font-semibold">aqua@delivery.com</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="text-2xl font-bold text-primary">{getPaymentValue()}</p>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                Sua assinatura será confirmada em até 24h úteis após a confirmação do pagamento.
              </AlertDescription>
            </Alert>

            <Button className="w-full" onClick={handlePaymentConfirmed}>
              Já realizei o pagamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell className="font-medium">{payment.value}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {payment.status}
                        </Badge>
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
