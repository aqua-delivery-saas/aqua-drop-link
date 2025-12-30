import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import heroWater from "@/assets/hero-water.jpg";

const LoginDistributor = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isDistributor, isLoading: authLoading, role } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated as distributor
  useEffect(() => {
    if (!authLoading && isAuthenticated && role) {
      if (isDistributor()) {
        navigate("/distributor/dashboard");
      }
    }
  }, [isAuthenticated, authLoading, role, isDistributor, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    
    try {
      await login(email, password);
      
      // Role will be fetched by the auth hook, we need to wait for it
      // The useEffect above will handle the redirect once role is set
      toast.success("Login realizado com sucesso!");
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      if (errorMessage.includes('Invalid login credentials')) {
        toast.error("E-mail ou senha incorretos");
      } else if (errorMessage.includes('Email not confirmed')) {
        toast.error("E-mail não confirmado", {
          description: "Verifique sua caixa de entrada",
        });
      } else {
        toast.error("Erro ao fazer login", { description: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src={heroWater} 
          alt="Aqua Delivery" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <Logo size="lg" />
            <p className="mt-6 text-xl">Gerencie sua distribuidora com eficiência</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center lg:hidden mb-4">
              <Logo size="md" />
            </div>
            <CardTitle className="text-3xl">Entrar no Painel</CardTitle>
            <CardDescription>Acesse sua conta de distribuidora</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading || authLoading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Não tem conta? </span>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => navigate("/distributor/signup")}
                >
                  Criar conta da distribuidora
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginDistributor;
