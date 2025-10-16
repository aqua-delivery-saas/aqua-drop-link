import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { toast } from "sonner";

const LoyaltyProgram = () => {
  const [enabled, setEnabled] = useState(true);
  const [programName, setProgramName] = useState("Clube Água Pura");
  const [description, setDescription] = useState(
    "Acumule pontos a cada compra e ganhe recompensas exclusivas!"
  );
  const [pointsPerOrder, setPointsPerOrder] = useState(10);
  const [minValue, setMinValue] = useState(50);

  const handleSave = () => {
    toast.success("Programa de fidelização salvo com sucesso!");
  };

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

          <Button onClick={handleSave} size="lg" className="w-full">
            Salvar Programa
          </Button>
        </div>
      </main>
    </div>
  );
};

export default LoyaltyProgram;
