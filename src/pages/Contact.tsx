import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const CONTACT_EMAIL = "contato@aquadelivery.com.br";

const contactSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  subject: z.string().min(1, "Selecione um assunto"),
  message: z.string().trim().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(2000),
});

const subjectMap: Record<string, string> = {
  comercial: "Contato Comercial",
  parceria: "Proposta de Parceria",
  suporte: "Suporte Técnico",
  imprensa: "Imprensa",
  outro: "Outro Assunto",
};

export default function Contact() {
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
      contactSchema.parse(formData);
      setIsSubmitting(true);

      const subject = `[AquaDelivery] ${subjectMap[formData.subject] || formData.subject}`;
      const body =
        `Nome: ${formData.name}\n` +
        `E-mail: ${formData.email}\n` +
        `Assunto: ${subjectMap[formData.subject] || formData.subject}\n\n` +
        `Mensagem:\n${formData.message}`;

      const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;

      toast({
        title: "Abrindo seu cliente de e-mail",
        description: `Envie a mensagem para ${CONTACT_EMAIL} para concluir.`,
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
        <title>Contato - AquaDelivery</title>
        <meta
          name="description"
          content="Fale com a equipe AquaDelivery. Envie dúvidas comerciais, parcerias ou suporte pelo nosso formulário de contato."
        />
        <meta property="og:title" content="Contato - AquaDelivery" />
        <meta property="og:description" content="Fale com a equipe AquaDelivery pelo nosso formulário de contato." />
        <meta property="og:url" content="https://aqua-drop-link.lovable.app/contact" />
        <link rel="canonical" href="https://aqua-drop-link.lovable.app/contact" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-6 px-3 sm:py-12 sm:px-4">
        <div className="max-w-5xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 sm:mb-6">
            ← Voltar
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Entre em Contato</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Tem dúvidas, sugestões ou uma proposta? Preencha o formulário e nossa equipe responderá em breve.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {/* Contact Info */}
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">E-mail</CardTitle>
                  </div>
                  <CardDescription>Resposta em até 24h úteis</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Suporte</CardTitle>
                  </div>
                  <CardDescription>Central de ajuda e FAQ</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/support")}>
                    Ir para Suporte
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Atendimento</CardTitle>
                  </div>
                  <CardDescription>Segunda a sexta, 9h às 18h</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Brasil — atendimento em todo o território nacional</p>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-2xl">Envie sua Mensagem</CardTitle>
                <CardDescription>
                  Ao enviar, seu cliente de e-mail será aberto com a mensagem pronta para {CONTACT_EMAIL}.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto *</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o assunto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comercial">Contato Comercial</SelectItem>
                        <SelectItem value="parceria">Proposta de Parceria</SelectItem>
                        <SelectItem value="suporte">Suporte Técnico</SelectItem>
                        <SelectItem value="imprensa">Imprensa</SelectItem>
                        <SelectItem value="outro">Outro Assunto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Descreva sua mensagem..."
                      className="min-h-[150px]"
                      required
                    />
                    <p className="text-xs text-muted-foreground">{formData.message.length}/2000 caracteres</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? "Abrindo..." : "Enviar Mensagem"}
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
