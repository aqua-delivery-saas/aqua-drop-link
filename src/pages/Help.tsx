import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HelpCircle, Search } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    category: "Pedidos",
    items: [
      {
        question: "Como faço um pedido?",
        answer:
          "Acesse a página da distribuidora, escolha os produtos desejados, adicione ao carrinho e finalize o pedido preenchendo seus dados de entrega.",
      },
      {
        question: "Posso cancelar um pedido?",
        answer:
          "Sim, você pode cancelar um pedido através da página 'Meus Pedidos' antes que ele seja processado pela distribuidora. Após o processamento, entre em contato diretamente com a distribuidora.",
      },
      {
        question: "Como acompanho meu pedido?",
        answer:
          "Você pode acompanhar o status do seu pedido na página 'Histórico de Pedidos'. Você receberá notificações sobre mudanças no status.",
      },
    ],
  },
  {
    category: "Pagamentos",
    items: [
      {
        question: "Quais formas de pagamento são aceitas?",
        answer:
          "As distribuidoras podem aceitar pagamento na entrega (Pix, dinheiro ou cartão). As formas disponíveis variam por distribuidora.",
      },
      {
        question: "Como funciona o pagamento via PIX?",
        answer:
          "Ao finalizar o pedido, você receberá a chave PIX para realizar o pagamento. Após confirmar, envie o comprovante através da plataforma.",
      },
      {
        question: "Posso parcelar o pagamento?",
        answer: "Depende da distribuidora. Algumas aceitam parcelamento através de cartão de crédito na entrega.",
      },
    ],
  },
  {
    category: "Conta",
    items: [
      {
        question: "Como criar uma conta?",
        answer:
          "Clique em 'Cadastrar-se', preencha seus dados básicos e confirme seu e-mail. Para distribuidoras, há um cadastro específico com mais informações empresariais.",
      },
      {
        question: "Esqueci minha senha, o que faço?",
        answer: "Na tela de login, clique em 'Esqueci minha senha' e siga as instruções enviadas para seu e-mail.",
      },
      {
        question: "Como altero meus dados cadastrais?",
        answer: "Acesse 'Meu Perfil' no menu e edite as informações desejadas. Não esqueça de salvar as alterações.",
      },
    ],
  },
  {
    category: "Para Distribuidoras",
    items: [
      {
        question: "Como cadastro minha distribuidora?",
        answer:
          "Clique em 'Sou Distribuidora' na página inicial, preencha o formulário com os dados da empresa e escolha um plano de assinatura.",
      },
      {
        question: "Como gerencio meus produtos?",
        answer:
          "No painel da distribuidora, acesse 'Produtos' para adicionar, editar ou remover itens do seu catálogo.",
      },
      {
        question: "Como funciona a assinatura?",
        answer:
          "Oferecemos planos mensais e anuais com diferentes limites de pedidos e funcionalidades. Você pode alterar ou cancelar seu plano a qualquer momento.",
      },
      {
        question: "Como configurar horário de atendimento?",
        answer:
          "Acesse 'Configurações' > 'Horário de Atendimento' e defina seus horários de funcionamento para cada dia da semana.",
      },
    ],
  },
];

export default function Help() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaq = faqData
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <>
      <Helmet>
        <title>Central de Ajuda - FAQ</title>
        <meta
          name="description"
          content="Encontre respostas para as perguntas mais frequentes sobre nossa plataforma"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-4 px-3 sm:py-6 sm:px-4">
        <div className="container max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 sm:mb-6">
            ← Voltar
          </Button>

          <Card>
            <CardHeader className="text-center border-b px-4 sm:px-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <HelpCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl mb-4">Central de Ajuda</CardTitle>

              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por pergunta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {filteredFaq.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Nenhuma pergunta encontrada. Tente outra busca ou{" "}
                    <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/support")}>
                      entre em contato
                    </Button>
                    .
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredFaq.map((category, idx) => (
                    <div key={idx}>
                      <h2 className="text-xl font-semibold mb-4 text-primary">{category.category}</h2>
                      <Accordion type="single" collapsible className="w-full">
                        {category.items.map((item, itemIdx) => (
                          <AccordionItem key={itemIdx} value={`item-${idx}-${itemIdx}`}>
                            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-8 border-t text-center">
                <p className="text-muted-foreground mb-4">Não encontrou o que procurava?</p>
                <Button onClick={() => navigate("/support")}>Entrar em Contato com Suporte</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
