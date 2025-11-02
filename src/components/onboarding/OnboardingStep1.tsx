import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100, "Nome muito longo"),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido (formato: 00.000.000/0000-00)"),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido (formato: (00) 00000-0000)"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres").max(200, "Endereço muito longo"),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres").max(100, "Cidade muito longa"),
  state: z.string().length(2, "Estado deve ter 2 caracteres (sigla)"),
});

interface OnboardingStep1Props {
  onNext: (data: any) => void;
  initialData?: z.infer<typeof formSchema>;
}

export const OnboardingStep1 = ({ onNext, initialData }: OnboardingStep1Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      cnpj: "",
      phone: "",
      address: "",
      city: "",
      state: "",
    },
  });

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
                  <Input placeholder="00.000.000/0000-00" {...field} />
                </FormControl>
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
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço *</FormLabel>
              <FormControl>
                <Input placeholder="Rua, número, bairro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Cidade *</FormLabel>
                <FormControl>
                  <Input placeholder="São Paulo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado *</FormLabel>
                <FormControl>
                  <Input placeholder="SP" maxLength={2} {...field} />
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
