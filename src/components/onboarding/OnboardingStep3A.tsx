import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Marcas pré-cadastradas pelo administrador do SaaS
const marcasPadrao = [
  { id: "1", nome: "Indaiá", litros: 20, logo: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=100&h=100&fit=crop" },
  { id: "2", nome: "Bioleve", litros: 20, logo: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=100&h=100&fit=crop" },
  { id: "3", nome: "Cristal Premium", litros: 20, logo: "https://images.unsplash.com/photo-1606168094336-48f205276929?w=100&h=100&fit=crop" },
  { id: "4", nome: "Minalba", litros: 20, logo: "https://images.unsplash.com/photo-1564419320461-6870880221ad?w=100&h=100&fit=crop" },
  { id: "5", nome: "Crystal", litros: 20, logo: "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=100&h=100&fit=crop" },
  { id: "6", nome: "Bonafont", litros: 20, logo: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=100&h=100&fit=crop" },
  { id: "7", nome: "Petrópolis", litros: 20, logo: "https://images.unsplash.com/photo-1559839914-17aae19cec71?w=100&h=100&fit=crop" },
  { id: "8", nome: "Schin", litros: 20, logo: "https://images.unsplash.com/photo-1606168094336-48f205276929?w=100&h=100&fit=crop" },
];

export interface MarcaSelecionada {
  id: string;
  nome: string;
  litros: number;
  logo: string;
  preco?: number;
}

interface OnboardingStep3AProps {
  onNext: (data: { marcasSelecionadas: MarcaSelecionada[] }) => void;
  onBack: () => void;
  initialData?: MarcaSelecionada[];
}

export const OnboardingStep3A = ({ onNext, onBack, initialData }: OnboardingStep3AProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialData?.map(m => m.id) || []
  );
  const [error, setError] = useState<string | null>(null);

  const toggleBrand = (id: string) => {
    setError(null);
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selectedIds.length === 0) {
      setError("Selecione pelo menos uma marca para continuar");
      return;
    }
    
    const marcasSelecionadas = marcasPadrao
      .filter(m => selectedIds.includes(m.id))
      .map(m => ({
        id: m.id,
        nome: m.nome,
        litros: m.litros,
        logo: m.logo,
        preco: initialData?.find(i => i.id === m.id)?.preco,
      }));
    
    onNext({ marcasSelecionadas });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Selecionar Marcas</h2>
        <p className="text-muted-foreground">Escolha as marcas de água que você trabalha</p>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-2">
        {marcasPadrao.map((marca) => {
          const isSelected = selectedIds.includes(marca.id);
          return (
            <Card
              key={marca.id}
              className={`p-4 cursor-pointer transition-all border-2 ${
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : "border-transparent hover:border-muted-foreground/20"
              }`}
              onClick={() => toggleBrand(marca.id)}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleBrand(marca.id)}
                  className="pointer-events-none"
                />
                <Avatar className="h-10 w-10">
                  <AvatarImage src={marca.logo} alt={marca.nome} />
                  <AvatarFallback>{marca.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{marca.nome}</p>
                  <p className="text-sm text-muted-foreground">{marca.litros}L</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground text-center">
        {selectedIds.length} marca{selectedIds.length !== 1 ? "s" : ""} selecionada{selectedIds.length !== 1 ? "s" : ""}
      </p>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button onClick={handleNext} size="lg">
          Próximo: Definir Preços
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
