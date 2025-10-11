import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/Logo";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    name: "Distribuidora Água Pura",
    address: "Rua das Águas, 123 - Centro",
    whatsapp: "(11) 99999-9999",
    paymentMethods: {
      cash: true,
      card: true,
      pix: true,
    },
  });

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [e.target.id]: e.target.value,
    });
  };

  const handlePaymentMethodChange = (method: keyof typeof settings.paymentMethods) => {
    setSettings({
      ...settings,
      paymentMethods: {
        ...settings.paymentMethods,
        [method]: !settings.paymentMethods[method],
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          <Button variant="ghost" onClick={() => navigate("/distributor/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Painel
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configurações da Distribuidora</h1>
          <p className="text-muted-foreground">Ajuste suas informações e preferências</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>Dados básicos da sua distribuidora</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Distribuidora</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">Número de WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={settings.whatsapp}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">
                  Este número será usado para gerar links wa.me
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formas de Pagamento</CardTitle>
              <CardDescription>Selecione os métodos de pagamento aceitos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cash"
                  checked={settings.paymentMethods.cash}
                  onCheckedChange={() => handlePaymentMethodChange("cash")}
                />
                <Label htmlFor="cash" className="cursor-pointer">Dinheiro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="card"
                  checked={settings.paymentMethods.card}
                  onCheckedChange={() => handlePaymentMethodChange("card")}
                />
                <Label htmlFor="card" className="cursor-pointer">Cartão na Entrega</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pix"
                  checked={settings.paymentMethods.pix}
                  onCheckedChange={() => handlePaymentMethodChange("pix")}
                />
                <Label htmlFor="pix" className="cursor-pointer">Pix (Manual)</Label>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} size="lg" className="w-full">
            Salvar Alterações
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
