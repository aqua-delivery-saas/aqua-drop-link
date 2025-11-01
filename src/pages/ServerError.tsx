import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ServerCrash } from "lucide-react";

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Erro 500 - Erro Interno do Servidor</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-destructive/10 rounded-full">
                <ServerCrash className="w-16 h-16 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-3xl mb-2">500</CardTitle>
            <p className="text-xl font-semibold">Erro Interno do Servidor</p>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Ops! Algo deu errado do nosso lado. Nossa equipe já foi notificada e está trabalhando para resolver o problema.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate(-1)} variant="outline">
                ← Voltar
              </Button>
              <Button onClick={() => navigate("/")}>
                Ir para o Início
              </Button>
            </div>

            <p className="text-sm text-muted-foreground pt-4">
              Se o problema persistir, entre em contato com nosso suporte.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
