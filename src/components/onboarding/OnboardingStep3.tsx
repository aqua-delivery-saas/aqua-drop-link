import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(100, "Nome muito longo"),
  price: z.coerce.number().min(0.01, "Preço deve ser maior que zero"),
});

interface OnboardingStep3Props {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: z.infer<typeof productSchema>[];
}

export const OnboardingStep3 = ({ onNext, onBack, initialData }: OnboardingStep3Props) => {
  const [products, setProducts] = useState<z.infer<typeof productSchema>[]>(
    initialData || [{ name: "Galão 20L", price: 15.0 }]
  );

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    setProducts([...products, values]);
    form.reset();
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (products.length === 0) {
      form.setError("name", { message: "Adicione pelo menos um produto" });
      return;
    }
    onNext({ products });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Adicionar Produtos</h2>
        <p className="text-muted-foreground">Cadastre os produtos que você vende</p>
      </div>

      {/* Lista de produtos adicionados */}
      {products.length > 0 && (
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {products.map((product, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {product.price.toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProduct(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Formulário para adicionar novo produto */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Produto</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Galão 20L" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="15.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto
          </Button>
        </form>
      </Form>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button onClick={handleNext} size="lg">
          Próximo
        </Button>
      </div>
    </div>
  );
};
