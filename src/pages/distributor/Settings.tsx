import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { formatPhone } from "@/lib/validators";

const Settings = () => {
  const [settings, setSettings] = useState({
    name: "Distribuidora Água Pura",
    slug: "distribuidora-agua-pura",
    cnpj: "12.345.678/0001-90",
    whatsapp: "5521999999999",
    
    // Structured address
    rua: "Rua das Palmeiras",
    numero: "123",
    bairro: "Copacabana",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    cep: "22070-000",
    email_contato: "contato@aguapura.com.br",
    telefone: "21 3333-4444",
    site: "https://aguapura.com.br",
    
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
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Informações da Empresa</h1>
          <p className="text-muted-foreground">Dados cadastrais e de contato da sua distribuidora</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Dados básicos e de contato da sua distribuidora
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={settings.slug}
                  onChange={handleChange}
                  placeholder="distribuidora-agua-pura"
                />
                <p className="text-sm text-muted-foreground">
                  URL de acesso: /order/{settings.slug}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={settings.cnpj}
                  onChange={handleChange}
                  placeholder="00.000.000/0000-00"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={settings.whatsapp}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setSettings({ ...settings, whatsapp: formatted });
                    }}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={settings.telefone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setSettings({ ...settings, telefone: formatted });
                    }}
                    placeholder="(00) 0000-0000"
                    maxLength={15}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email_contato">Email de Contato</Label>
                <Input
                  id="email_contato"
                  type="email"
                  value={settings.email_contato}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site">Site (opcional)</Label>
                <Input
                  id="site"
                  type="url"
                  value={settings.site}
                  onChange={handleChange}
                  placeholder="https://seusite.com.br"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endereço Completo</CardTitle>
              <CardDescription>
                Informações de localização estruturadas para SEO
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="rua">Rua/Avenida</Label>
                  <Input
                    id="rua"
                    value={settings.rua}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={settings.numero}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={settings.bairro}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={settings.cidade}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={settings.estado}
                    onChange={handleChange}
                    maxLength={2}
                    placeholder="RJ"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={settings.cep}
                  onChange={handleChange}
                  placeholder="00000-000"
                />
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
