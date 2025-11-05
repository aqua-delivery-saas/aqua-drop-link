import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { nameSchema, phoneSchema, simplePasswordSchema, formatPhone } from "@/lib/validators";

const formSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  address: z.string().min(5, "Endereço deve ter ao menos 5 caracteres").max(200, "Endereço muito longo"),
  password: simplePasswordSchema,
});

type FormData = z.infer<typeof formSchema>;

const SignupCustomer = () => {
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Conta criada com sucesso!");
      navigate("/customer/history");
    } catch (error) {
      toast.error("Erro ao criar conta. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <CardTitle className="text-3xl">Criar Conta</CardTitle>
          <CardDescription>Salve seus endereços e acompanhe seus pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="João Silva" {...field} />
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
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="(11) 99999-9999" 
                        {...field}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Padrão</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, número, complemento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Mínimo 6 caracteres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                size="lg" 
                className="w-full" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Criando conta..." : "Cadastrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupCustomer;
