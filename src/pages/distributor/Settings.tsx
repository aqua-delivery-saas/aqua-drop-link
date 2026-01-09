import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatPhone } from "@/lib/validators";
import { useDistributor, useUpdateDistributor } from "@/hooks/useDistributor";

const Settings = () => {
  const { data: distributor, isLoading } = useDistributor();
  const updateDistributor = useUpdateDistributor();

  const [settings, setSettings] = useState({
    name: "",
    slug: "",
    cnpj: "",
    whatsapp: "",
    rua: "",
    numero: "",
    bairro: "",
    cep: "",
    email_contato: "",
    telefone: "",
    paymentMethods: {
      cash: true,
      card: true,
      pix: true,
    },
  });

  useEffect(() => {
    if (distributor) {
      setSettings({
        name: distributor.name || "",
        slug: distributor.slug || "",
        cnpj: distributor.cnpj || "",
        whatsapp: distributor.whatsapp || "",
        rua: distributor.street || "",
        numero: distributor.number || "",
        bairro: distributor.neighborhood || "",
        cep: distributor.zip_code || "",
        email_contato: distributor.email || "",
        telefone: distributor.phone || "",
        paymentMethods: {
          cash: distributor.accepts_cash ?? true,
          card: distributor.accepts_card ?? true,
          pix: distributor.accepts_pix ?? true,
        },
      });
    }
  }, [distributor]);

  const handleSave = async () => {
    await updateDistributor.mutateAsync({
      name: settings.name,
      slug: settings.slug,
      cnpj: settings.cnpj,
      whatsapp: settings.whatsapp,
      street: settings.rua,
      number: settings.numero,
      neighborhood: settings.bairro,
      zip_code: settings.cep,
      email: settings.email_contato,
      phone: settings.telefone,
      accepts_cash: settings.paymentMethods.cash,
      accepts_card: settings.paymentMethods.card,
      accepts_pix: settings.paymentMethods.pix,
    });
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

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Informações da Empresa</h1>
        <p className="text-muted-foreground">Dados cadastrais e de contato da sua distribuidora</p>
      </div>

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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
          <CardDescription>
            Informações de localização da distribuidora
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

      <Button 
        onClick={handleSave} 
        size="lg" 
        className="w-full"
        disabled={updateDistributor.isPending}
      >
        {updateDistributor.isPending ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </div>
  );
};

export default Settings;