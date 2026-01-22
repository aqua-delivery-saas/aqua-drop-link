import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, Share2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface OnboardingStep4Props {
  onFinish: () => void;
  onBack: () => void;
  distributorData?: {
    name: string;
    city: string;
  };
}

export const OnboardingStep4 = ({ onFinish, onBack, distributorData }: OnboardingStep4Props) => {
  const [copied, setCopied] = useState(false);
  
  // Gerar slug baseado no nome da distribuidora
  const generateSlug = (name?: string) => {
    if (!name) return "sua-distribuidora";
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const slug = generateSlug(distributorData?.name);
  const orderLink = `${window.location.origin}/order/${slug}`;
  const whatsappMessage = `Olá! Faça seu pedido de água através do nosso sistema: ${orderLink}`;
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderLink);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Tudo Pronto!</h2>
        <p className="text-muted-foreground">Seu link de pedidos foi gerado</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
        <Label className="text-sm font-medium mb-2 block">Seu Link Personalizado</Label>
        <div className="flex gap-2 mb-4">
          <Input 
            value={orderLink} 
            readOnly 
            className="font-mono text-sm bg-background"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={copyToClipboard}
          >
            {copied ? <CheckCircle className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-3">
            Compartilhe este link com seus clientes para que eles possam fazer pedidos online.
          </p>
          
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => window.open(whatsappLink, '_blank')}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar no WhatsApp
          </Button>
        </div>
      </Card>

      <Card className="p-4 border-primary/20">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Próximos Passos
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Personalize seu perfil e adicione mais produtos</li>
          <li>• Configure promoções e programas de fidelidade</li>
          <li>• Acompanhe seus pedidos em tempo real no painel</li>
          <li>• Configure notificações para não perder nenhum pedido</li>
        </ul>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button onClick={onFinish} size="lg">
          Ir para o Início
        </Button>
      </div>
    </div>
  );
};
