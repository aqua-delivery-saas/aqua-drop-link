import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface DiscountRule {
  id: number;
  min: number;
  max: number;
  discount: number;
}

const DiscountSettings = () => {
  const [rules, setRules] = useState<DiscountRule[]>([
    { id: 1, min: 5, max: 10, discount: 5 },
    { id: 2, min: 11, max: 999, discount: 10 },
  ]);

  const handleChange = (id: number, field: keyof Omit<DiscountRule, "id">, value: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const handleAdd = () => {
    const maxId = Math.max(...rules.map(r => r.id), 0);
    setRules([...rules, { id: maxId + 1, min: 1, max: 5, discount: 0 }]);
  };

  const handleRemove = (id: number) => {
    if (rules.length > 1) {
      setRules(rules.filter(rule => rule.id !== id));
    } else {
      toast.error("Deve haver pelo menos uma regra de desconto!");
    }
  };

  const handleSave = () => {
    toast.success("Regras de desconto salvas com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Desconto por Quantidade</h1>
          <p className="text-muted-foreground">Configure descontos progressivos automáticos</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Desconto</CardTitle>
              <CardDescription>
                Defina faixas de quantidade e seus respectivos descontos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  <strong>Exemplo:</strong> De 5 a 10 galões = 5% de desconto. Acima de 11 galões = 10% de desconto.
                </AlertDescription>
              </Alert>

              {rules.map((rule, index) => (
                <div key={rule.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Regra {index + 1}</Label>
                    {rules.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`min-${rule.id}`}>Quantidade Mínima</Label>
                      <Input
                        id={`min-${rule.id}`}
                        type="number"
                        min="1"
                        value={rule.min}
                        onChange={(e) => handleChange(rule.id, "min", Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`max-${rule.id}`}>Quantidade Máxima</Label>
                      <Input
                        id={`max-${rule.id}`}
                        type="number"
                        min="1"
                        value={rule.max}
                        onChange={(e) => handleChange(rule.id, "max", Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`discount-${rule.id}`}>Desconto (%)</Label>
                      <Input
                        id={`discount-${rule.id}`}
                        type="number"
                        min="0"
                        max="100"
                        value={rule.discount}
                        onChange={(e) => handleChange(rule.id, "discount", Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={handleAdd} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Regra de Desconto
              </Button>
            </CardContent>
          </Card>

          <Button onClick={handleSave} size="lg" className="w-full">
            Salvar Regras
          </Button>
        </div>
      </main>
    </div>
  );
};

export default DiscountSettings;
