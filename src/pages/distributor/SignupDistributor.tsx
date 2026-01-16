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
import { useAuth } from "@/hooks/useAuth";
import { SocialLoginButtons } from "@/components/SocialLoginButtons";

const formSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: simplePasswordSchema,
  confirmPassword: z.string().min(1, "Confirme sua senha"),
  whatsapp: whatsappSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
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
      confirmPassword: "",
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
          form.setError('email', {
            type: 'manual',
            message: 'Este e-mail já está cadastrado'
          });
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

      // 4. Update auth state with the new role to prevent 403 redirect
      useAuth.getState().setRole('distributor');

      toast.success("Conta criada com sucesso!", {
        description: "Complete o cadastro da sua distribuidora",
      });
      
      // Small delay to ensure state synchronization
      await new Promise(resolve => setTimeout(resolve, 100));
      
      navigate("/distributor/onboarding");
    } catch (error) {
      console.error('Signup error:', error);
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <CardTitle className="text-3xl">Criar Conta</CardTitle>
          <CardDescription>Dados do responsável pela distribuidora</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <SocialLoginButtons 
              redirectPath="/distributor/onboarding" 
              accountType="distributor"
              enabledProviders={["google"]}
            />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="João da Silva" {...field} />
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
                      <Input 
                        type="email" 
                        placeholder="seu@email.com" 
                        className={form.formState.errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                        {...field} 
                      />
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Digite a senha novamente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu WhatsApp Pessoal</FormLabel>
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
                      Você receberá notificações neste número
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
            </form>
          </Form>

          <div className="text-center text-sm mt-4">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupDistributor;
