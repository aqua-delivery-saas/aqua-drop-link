import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarcaSelecionada } from "./OnboardingStep3A";

interface OnboardingStep3BProps {
  onNext: (data: { products: MarcaSelecionada[] }) => void;
  onBack: () => void;
  marcasSelecionadas: MarcaSelecionada[];
}

export const OnboardingStep3B = ({ onNext, onBack, marcasSelecionadas }: OnboardingStep3BProps) => {
  const [precos, setPrecos] = useState<Record<string, number>>(
    marcasSelecionadas.reduce((acc, m) => ({
      ...acc,
      [m.id]: m.preco || 0,
    }), {})
  );
  const [error, setError] = useState<string | null>(null);

  const handlePrecoChange = (id: string, value: string) => {
    setError(null);
    const numValue = parseFloat(value) || 0;
    setPrecos(prev => ({ ...prev, [id]: numValue }));
  };

  const handleSubmit = () => {
    // Verificar se todos os preços foram preenchidos
    const todosPreenchidos = marcasSelecionadas.every(m => precos[m.id] > 0);
    
    if (!todosPreenchidos) {
      setError("Preencha o preço de todas as marcas");
      return;
    }

    const products = marcasSelecionadas.map(m => ({
      ...m,
      preco: precos[m.id],
    }));

    onNext({ products });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Definir Preços</h2>
        <p className="text-muted-foreground">Informe o preço de cada marca selecionada</p>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
        {marcasSelecionadas.map((marca) => (
          <Card key={marca.id} className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={marca.logo} alt={marca.nome} />
                <AvatarFallback>{marca.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <p className="font-medium">{marca.nome}</p>
                <p className="text-sm text-muted-foreground">{marca.litros}L</p>
              </div>
              
              <div className="w-32">
                <Label htmlFor={`preco-${marca.id}`} className="sr-only">
                  Preço
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    R$
                  </span>
                  <Input
                    id={`preco-${marca.id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={precos[marca.id] || ""}
                    onChange={(e) => handlePrecoChange(marca.id, e.target.value)}
                    className="pl-9 text-right"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Marcas
        </Button>
        <Button onClick={handleSubmit} size="lg">
          <Check className="w-4 h-4 mr-2" />
          Salvar e Continuar
        </Button>
      </div>
    </div>
  );
};
