import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";
import { cnpjSchema, phoneSchema, nameSchema, formatCNPJ, formatPhone } from "@/lib/validators";
import { useCepLookup } from "@/hooks/useCepLookup";
import { findCityByNameAndState } from "@/hooks/useCities";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: nameSchema,
  cnpj: cnpjSchema,
  phone: phoneSchema,
  zip_code: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido (formato: 00000-000)"),
  street: z.string().min(3, "Rua deve ter pelo menos 3 caracteres").max(200, "Rua muito longa"),
  number: z.string().min(1, "Número é obrigatório").max(20, "Número muito longo"),
  complement: z.string().max(100, "Complemento muito longo").optional(),
  neighborhood: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres").max(100, "Bairro muito longo"),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres").max(100, "Cidade muito longa"),
  city_id: z.string().nullable().optional(),
  state: z.string().length(2, "Estado é obrigatório"),
});

interface OnboardingStep1Props {
  onNext: (data: any) => void;
  initialData?: z.infer<typeof formSchema>;
}

export const OnboardingStep1 = ({ onNext, initialData }: OnboardingStep1Props) => {
  const { toast } = useToast();
  const { fetchAddress, isLoading: isCepLoading, error: cepError, clearError } = useCepLookup();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      cnpj: "",
      phone: "",
      zip_code: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      city_id: null,
      state: "",
    },
  });

  const formatCep = (value: string) => {
    let cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 5) {
      cleaned = cleaned.slice(0, 5) + '-' + cleaned.slice(5, 8);
    }
    return cleaned;
  };

  const handleCepChange = useCallback(async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {
      const address = await fetchAddress(cleanCep);
      
      if (address) {
        form.setValue("street", address.street);
        form.setValue("neighborhood", address.neighborhood);
        form.setValue("city", address.city);
        form.setValue("state", address.state);
        
        // Check if city exists in database
        try {
          const existingCity = await findCityByNameAndState(address.city, address.state);
          form.setValue("city_id", existingCity?.id || null);
        } catch {
          form.setValue("city_id", null);
        }
        
        // Clear validation errors for auto-filled fields
        form.clearErrors(["street", "neighborhood", "city", "state"]);
      }
    }
  }, [fetchAddress, form]);

  useEffect(() => {
    if (cepError) {
      toast({
        title: "CEP não encontrado",
        description: "Verifique o CEP digitado e tente novamente.",
        variant: "destructive",
      });
      clearError();
    }
  }, [cepError, toast, clearError]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onNext({ distributor: values });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2">Dados da Distribuidora</h2>
          <p className="text-muted-foreground">Preencha as informações básicas da sua empresa</p>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Distribuidora *</FormLabel>
              <FormControl>
                <Input placeholder="Água Cristalina Ltda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="00.000.000/0000-00" 
                    {...field}
                    onChange={(e) => {
                      const formatted = formatCNPJ(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                </FormControl>
                <FormDescription>Formato: XX.XXX.XXX/XXXX-XX</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone *</FormLabel>
                <FormControl>
                  <Input 
                    type="tel"
                    placeholder="(00) 00000-0000" 
                    {...field}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                </FormControl>
                <FormDescription>Formato: (XX) XXXXX-XXXX</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="zip_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="00000-000" 
                    {...field}
                    onChange={(e) => {
                      const formatted = formatCep(e.target.value);
                      field.onChange(formatted);
                      handleCepChange(formatted);
                    }}
                  />
                  {isCepLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>Digite o CEP para preencher o endereço automaticamente</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rua/Logradouro *</FormLabel>
              <FormControl>
                <Input placeholder="Rua das Flores" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número *</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complement"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input placeholder="Sala 101, Bloco A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro *</FormLabel>
              <FormControl>
                <Input placeholder="Centro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled 
                    placeholder="UF"
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Cidade *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled 
                    placeholder="Preenchido pelo CEP"
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">Adicionar logo da distribuidora (opcional)</p>
          <p className="text-xs text-muted-foreground">Arraste uma imagem ou clique para selecionar</p>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg">Próximo</Button>
        </div>
      </form>
    </Form>
  );
};
