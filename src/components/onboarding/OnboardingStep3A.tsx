import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useBrands } from "@/hooks/useBrands";

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
  const { data: brands, isLoading } = useBrands();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialData?.map(m => m.id) || []
  );
  const [error, setError] = useState<string | null>(null);

  // Map brands from database to component format
  const marcasDisponiveis = brands?.filter(b => b.is_active).map(brand => ({
    id: brand.id,
    nome: brand.name,
    litros: 20, // Default value for galões
    logo: brand.logo_url || "",
  })) || [];

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
    
    const marcasSelecionadas = marcasDisponiveis
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando marcas disponíveis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Selecionar Marcas</h2>
        <p className="text-muted-foreground">Escolha as marcas de água que você trabalha</p>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      {marcasDisponiveis.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma marca disponível no momento.</p>
          <p className="text-sm">Entre em contato com o administrador.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-2">
        {marcasDisponiveis.map((marca) => {
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
      )}

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
