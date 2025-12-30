import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "lucide-react";
import { useDistributorLoyaltyProgram, useSaveLoyaltyProgram } from "@/hooks/useDistributor";

const LoyaltyProgram = () => {
  const { data: loyaltyProgram, isLoading } = useDistributorLoyaltyProgram();
  const saveLoyaltyProgram = useSaveLoyaltyProgram();

  const [enabled, setEnabled] = useState(false);
  const [programName, setProgramName] = useState("Programa de Fidelidade");
  const [description, setDescription] = useState("");
  const [pointsPerOrder, setPointsPerOrder] = useState(1);
  const [minValue, setMinValue] = useState(0);
  const [rewardThreshold, setRewardThreshold] = useState(10);
  const [rewardDescription, setRewardDescription] = useState("Galão grátis");

  useEffect(() => {
    if (loyaltyProgram) {
      setEnabled(loyaltyProgram.is_enabled);
      setProgramName(loyaltyProgram.program_name || "Programa de Fidelidade");
      setDescription(loyaltyProgram.description || "");
      setPointsPerOrder(loyaltyProgram.points_per_order);
      setMinValue(Number(loyaltyProgram.min_order_value) || 0);
      setRewardThreshold(loyaltyProgram.reward_threshold);
      setRewardDescription(loyaltyProgram.reward_description || "Galão grátis");
    }
  }, [loyaltyProgram]);

  const handleSave = async () => {
    await saveLoyaltyProgram.mutateAsync({
      is_enabled: enabled,
      program_name: programName,
      description,
      points_per_order: pointsPerOrder,
      min_order_value: minValue,
      reward_threshold: rewardThreshold,
      reward_description: rewardDescription,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-8">
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-10 w-full" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Programa de Fidelização</h1>
          <p className="text-muted-foreground">Configure recompensas para clientes recorrentes</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Programa</CardTitle>
              <CardDescription>
                Defina as regras básicas do programa de fidelização
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="program-enabled" className="text-base">
                    Ativar Programa de Fidelização
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Habilite o programa para seus clientes
                  </p>
                </div>
                <Switch
                  id="program-enabled"
                  checked={enabled}
                  onCheckedChange={setEnabled}
                />
              </div>

              {enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="program-name">Nome do Programa</Label>
                    <Input
                      id="program-name"
                      value={programName}
                      onChange={(e) => setProgramName(e.target.value)}
                      placeholder="Ex: Clube Água Pura"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição Breve</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Descreva os benefícios do programa"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="points-per-order">Pontos por Pedido</Label>
                      <Input
                        id="points-per-order"
                        type="number"
                        min="1"
                        value={pointsPerOrder}
                        onChange={(e) => setPointsPerOrder(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="min-value">Valor Mínimo (R$)</Label>
                      <Input
                        id="min-value"
                        type="number"
                        min="0"
                        value={minValue}
                        onChange={(e) => setMinValue(Number(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Para gerar pontos
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reward-threshold">Pontos para Resgatar</Label>
                      <Input
                        id="reward-threshold"
                        type="number"
                        min="1"
                        value={rewardThreshold}
                        onChange={(e) => setRewardThreshold(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reward-description">Recompensa</Label>
                      <Input
                        id="reward-description"
                        value={rewardDescription}
                        onChange={(e) => setRewardDescription(e.target.value)}
                        placeholder="Ex: Galão grátis"
                      />
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Nota:</strong> Nesta versão, o programa é apenas informativo, sem cálculo automático de pontos.
                      Em breve, teremos integração completa com o sistema de pedidos.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>

          <Button 
            onClick={handleSave} 
            size="lg" 
            className="w-full"
            disabled={saveLoyaltyProgram.isPending}
          >
            {saveLoyaltyProgram.isPending ? "Salvando..." : "Salvar Programa"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default LoyaltyProgram;