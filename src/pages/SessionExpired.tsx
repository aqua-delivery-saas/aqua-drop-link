import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Clock, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export default function SessionExpired() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/distributor/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Sessão Expirada</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-accent/10 rounded-full">
                <Clock className="w-16 h-16 text-accent" />
              </div>
            </div>
            <CardTitle className="text-2xl">Sessão Expirada</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Sua sessão expirou por motivos de segurança. Por favor, faça login novamente para continuar usando a plataforma.
            </p>

            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-2">
                Redirecionando em {countdown} segundos...
              </p>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </div>
            
            <Button 
              onClick={() => navigate("/distributor/login")} 
              className="w-full"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Fazer Login Agora
            </Button>

            <Button 
              onClick={() => navigate("/")} 
              variant="ghost"
              className="w-full"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
