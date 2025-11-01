import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Shield } from "lucide-react";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Política de Privacidade - Distribuidora de Água</title>
        <meta name="description" content="Conheça nossa política de privacidade e como protegemos seus dados" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            ← Voltar
          </Button>

          <Card>
            <CardHeader className="text-center border-b">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl">Política de Privacidade</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </CardHeader>
            
            <CardContent className="prose prose-sm max-w-none p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Introdução</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais 
                  em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Dados Coletados</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Coletamos os seguintes tipos de informações:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Dados de Cadastro:</strong> nome, e-mail, telefone, CPF/CNPJ, endereço</li>
                  <li><strong>Dados de Uso:</strong> logs de acesso, páginas visitadas, horários de navegação</li>
                  <li><strong>Dados de Pagamento:</strong> informações de transações financeiras (processadas por terceiros)</li>
                  <li><strong>Dados de Localização:</strong> quando necessário para entregas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Finalidade do Uso dos Dados</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Utilizamos seus dados para:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Criar e gerenciar sua conta na plataforma</li>
                  <li>Processar e gerenciar pedidos e entregas</li>
                  <li>Enviar notificações sobre pedidos e atualizações do serviço</li>
                  <li>Melhorar nossos serviços e experiência do usuário</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                  <li>Prevenir fraudes e garantir a segurança da plataforma</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Compartilhamento de Dados</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Seus dados podem ser compartilhados com:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Distribuidoras parceiras:</strong> para processamento de pedidos</li>
                  <li><strong>Processadores de pagamento:</strong> para transações financeiras</li>
                  <li><strong>Serviços de análise:</strong> para melhorias na plataforma</li>
                  <li><strong>Autoridades legais:</strong> quando exigido por lei</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Não vendemos seus dados pessoais para terceiros.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Armazenamento e Segurança</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, 
                  alteração, divulgação ou destruição. Seus dados são armazenados em servidores seguros com criptografia.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Seus Direitos (LGPD)</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Você tem direito a:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Confirmar a existência de tratamento de dados</li>
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
                  <li>Solicitar a portabilidade dos dados</li>
                  <li>Revogar o consentimento</li>
                  <li>Opor-se ao tratamento de dados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Cookies e Tecnologias Similares</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos cookies para melhorar sua experiência, analisar o uso da plataforma e personalizar conteúdo. 
                  Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Retenção de Dados</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas, exceto quando a lei exigir 
                  retenção por período maior. Após esse período, os dados serão excluídos ou anonimizados.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Alterações nesta Política</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos atualizar esta política periodicamente. Notificaremos sobre alterações significativas através da 
                  plataforma ou por e-mail.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Contato</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato através da nossa 
                  página de suporte ou pelo e-mail: privacidade@exemplo.com
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
