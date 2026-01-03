import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import heroWater from "@/assets/hero-water.jpg";

const ResetPasswordDistributor = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      }
      setCheckingSession(false);
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }

      toast.success("Senha atualizada com sucesso!");
      navigate("/distributor/login");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <>
        <Helmet>
          <title>Link Inválido - AquaDelivery</title>
        </Helmet>
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
              <CardHeader className="text-center">
                <div className="flex justify-center lg:hidden mb-4">
                  <Logo size="md" />
                </div>
                <CardTitle className="text-2xl">Link Inválido</CardTitle>
                <CardDescription>
                  Este link de recuperação de senha é inválido ou expirou.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={() => navigate("/distributor/login")}>
                  Voltar para Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Redefinir Senha - AquaDelivery</title>
        <meta name="description" content="Redefina sua senha para acessar sua conta de distribuidora" />
      </Helmet>
      
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
            <CardHeader className="text-center">
              <div className="flex justify-center lg:hidden mb-4">
                <Logo size="md" />
              </div>
              <CardTitle className="text-2xl">Redefinir Senha</CardTitle>
              <CardDescription>
                Digite sua nova senha abaixo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="******"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    "Atualizar Senha"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordDistributor;
