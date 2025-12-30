import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { emailSchema, simplePasswordSchema, nameSchema, whatsappSchema, formatPhone } from "@/lib/validators";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: simplePasswordSchema,
  whatsapp: whatsappSchema,
});

type FormData = z.infer<typeof formSchema>;

const SignupDistributor = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      whatsapp: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // 1. Create user in Supabase Auth
      const redirectUrl = `${window.location.origin}/distributor/onboarding`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: data.name,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          toast.error("Este e-mail já está cadastrado", {
            description: "Tente fazer login ou use outro e-mail",
          });
        } else {
          toast.error("Erro ao criar conta", { description: authError.message });
        }
        return;
      }

      if (!authData.user) {
        toast.error("Erro ao criar conta", { description: "Usuário não foi criado" });
        return;
      }

      // 2. Insert distributor role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'distributor' as const,
        });

      if (roleError) {
        console.error('Error inserting role:', roleError);
        toast.error("Erro ao configurar conta", { description: roleError.message });
        return;
      }

      // 3. Save initial data to sessionStorage for onboarding
      sessionStorage.setItem('distributorSignup', JSON.stringify({
        name: data.name,
        whatsapp: data.whatsapp,
        email: data.email,
      }));

      toast.success("Conta criada com sucesso!", {
        description: "Complete o cadastro da sua distribuidora",
      });
      
      navigate("/distributor/onboarding");
    } catch (error) {
      console.error('Signup error:', error);
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <CardTitle className="text-3xl">Criar Conta da Distribuidora</CardTitle>
          <CardDescription>Comece a gerenciar seus pedidos hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Distribuidora</FormLabel>
                    <FormControl>
                      <Input placeholder="Água Cristalina Ltda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contato@distribuidora.com" {...field} />
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
                    <FormDescription>
                      Deve conter ao menos uma letra maiúscula e um número
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
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
                    <FormDescription>
                      Formato: (DDD) 9XXXX-XXXX
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                size="lg" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Criando conta..." : "Cadastrar"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Já tem conta? </span>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => navigate("/distributor/login")}
                >
                  Entrar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupDistributor;
