import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FileText } from "lucide-react";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Termos de Uso - Distribuidora de Água</title>
        <meta name="description" content="Leia nossos termos de uso e condições de serviço" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-6 px-3 sm:py-12 sm:px-4">
        <div className="container max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 sm:mb-6"
          >
            ← Voltar
          </Button>

          <Card>
            <CardHeader className="text-center border-b px-4 sm:px-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl">Termos de Uso</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </CardHeader>
            
            <CardContent className="prose prose-sm max-w-none p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Aceitação dos Termos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ao acessar e usar esta plataforma, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. 
                  Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Uso da Plataforma</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nossa plataforma conecta distribuidoras de água com clientes. As distribuidoras são responsáveis por:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Manter informações precisas e atualizadas sobre produtos e serviços</li>
                  <li>Cumprir os horários de entrega estabelecidos</li>
                  <li>Garantir a qualidade dos produtos fornecidos</li>
                  <li>Respeitar as leis e regulamentos locais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Cadastro e Conta</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Para usar determinadas funcionalidades, você deve criar uma conta fornecendo informações precisas e completas. 
                  Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorram em sua conta.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Assinaturas e Pagamentos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Os planos de assinatura são cobrados conforme a periodicidade escolhida. O não pagamento pode resultar na suspensão 
                  ou cancelamento do acesso aos serviços premium. Reembolsos serão analisados caso a caso.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Propriedade Intelectual</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Todo o conteúdo presente nesta plataforma, incluindo textos, gráficos, logos e software, é de propriedade exclusiva 
                  ou licenciada por nós e está protegido por leis de propriedade intelectual.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Limitação de Responsabilidade</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Não nos responsabilizamos por danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso ou 
                  incapacidade de usar nossos serviços. A plataforma é fornecida "como está" sem garantias de qualquer tipo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Modificações dos Termos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Reservamos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente 
                  após a publicação. O uso continuado da plataforma constitui aceitação das modificações.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Contato</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Para questões sobre estes termos, entre em contato através da nossa página de suporte.
                </p>
              </section>

              <div className="pt-6 border-t mt-8">
                <Button onClick={() => navigate(-1)} className="w-full sm:w-auto">
                  Li e Compreendi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
