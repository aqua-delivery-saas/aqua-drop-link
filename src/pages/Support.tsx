import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
const supportSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  subject: z.string().min(1, "Selecione um assunto"),
  message: z.string().trim().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(1000),
});
const subjectMap: Record<string, string> = {
  pedido: "Dúvida sobre Pedido",
  pagamento: "Problema com Pagamento",
  conta: "Questão de Conta",
  tecnico: "Problema Técnico",
  distribuidora: "Sou Distribuidora",
  outro: "Outro Assunto",
};

// Número de WhatsApp do suporte
const SUPPORT_WHATSAPP = "5511999999999";
export default function Support() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      supportSchema.parse(formData);
      setIsSubmitting(true);

      // Formatar mensagem para WhatsApp
      const mensagem =
        `*Suporte - ${subjectMap[formData.subject] || formData.subject}*\n\n` +
        `*Nome:* ${formData.name}\n` +
        `*E-mail:* ${formData.email}\n\n` +
        `*Mensagem:*\n${formData.message}`;

      // Abrir WhatsApp com mensagem pré-preenchida
      const whatsappUrl = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
      window.open(whatsappUrl, "_blank");
      toast({
        title: "Redirecionando para WhatsApp",
        description: "Complete o envio da mensagem no WhatsApp.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erro de Validação",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Helmet>
        <title>Suporte - Entre em Contato</title>
        <meta name="description" content="Entre em contato com nossa equipe de suporte" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-6 px-3 sm:py-12 sm:px-4">
        <div className="container max-w-5xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 sm:mb-6">
            ← Voltar
          </Button>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {/* Contact Information - appears first on mobile */}
            <div className="space-y-4 sm:space-y-6 order-first md:order-first">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">E-mail</CardTitle>
                  </div>
                  <CardDescription>Envie sua dúvida por e-mail</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">suporte@aquadelivery.com.br</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">WhatsApp</CardTitle>
                  </div>
                  <CardDescription>Atendimento de seg a sex, 9h às 18h</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open("https://wa.me/+5573981631001", "_blank")}
                  >
                    Abrir WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form - appears after contact cards on mobile */}
            <Card className="md:col-span-2 order-last md:order-last">
              <CardHeader>
                <CardTitle className="text-2xl">Envie sua Mensagem</CardTitle>
                <CardDescription>Preencha o formulário abaixo e nossa equipe entrará em contato</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Seu nome"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto *</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          subject: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o assunto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pedido">Dúvida sobre Pedido</SelectItem>
                        <SelectItem value="pagamento">Problema com Pagamento</SelectItem>
                        <SelectItem value="conta">Questão de Conta</SelectItem>
                        <SelectItem value="tecnico">Problema Técnico</SelectItem>
                        <SelectItem value="distribuidora">Sou Distribuidora</SelectItem>
                        <SelectItem value="outro">Outro Assunto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          message: e.target.value,
                        })
                      }
                      placeholder="Descreva sua dúvida ou problema..."
                      className="min-h-[150px]"
                      required
                    />
                    <p className="text-xs text-muted-foreground">{formData.message.length}/1000 caracteres</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate("/help")}>
                      Ver FAQ
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
