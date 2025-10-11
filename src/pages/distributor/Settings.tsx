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
    businessHours: [
      { day: "Segunda-feira", open: "08:00", close: "18:00", active: true },
      { day: "Terça-feira", open: "08:00", close: "18:00", active: true },
      { day: "Quarta-feira", open: "08:00", close: "18:00", active: true },
      { day: "Quinta-feira", open: "08:00", close: "18:00", active: true },
      { day: "Sexta-feira", open: "08:00", close: "18:00", active: true },
      { day: "Sábado", open: "08:00", close: "13:00", active: true },
      { day: "Domingo", open: "08:00", close: "12:00", active: false },
    ],
    discounts: {
      tier1: { min: 5, max: 10, percentage: 5 },
      tier2: { min: 11, max: 999, percentage: 10 },
    },
    loyalty: {
      enabled: true,
      ordersRequired: 10,
      reward: "1 galão grátis",
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

  const handleBusinessHourChange = (index: number, field: string, value: string | boolean) => {
    const newHours = [...settings.businessHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setSettings({ ...settings, businessHours: newHours });
  };

  const handleDiscountChange = (tier: 'tier1' | 'tier2', field: string, value: number) => {
    setSettings({
      ...settings,
      discounts: {
        ...settings.discounts,
        [tier]: { ...settings.discounts[tier], [field]: value },
      },
    });
  };

  const handleLoyaltyChange = (field: string, value: boolean | number | string) => {
    setSettings({
      ...settings,
      loyalty: { ...settings.loyalty, [field]: value },
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

          <Card>
            <CardHeader>
              <CardTitle>Horário de Atendimento</CardTitle>
              <CardDescription>Configure os dias e horários de funcionamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.businessHours.map((schedule, index) => (
                <div key={schedule.day} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2 min-w-[140px]">
                    <Checkbox
                      id={`day-${index}`}
                      checked={schedule.active}
                      onCheckedChange={(checked) => 
                        handleBusinessHourChange(index, "active", checked as boolean)
                      }
                    />
                    <Label htmlFor={`day-${index}`} className="cursor-pointer font-medium">
                      {schedule.day}
                    </Label>
                  </div>
                  {schedule.active && (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={schedule.open}
                        onChange={(e) => handleBusinessHourChange(index, "open", e.target.value)}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">até</span>
                      <Input
                        type="time"
                        value={schedule.close}
                        onChange={(e) => handleBusinessHourChange(index, "close", e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Desconto por Quantidade</CardTitle>
              <CardDescription>Configure descontos progressivos automáticos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Faixa 1 de Desconto</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={settings.discounts.tier1.min}
                    onChange={(e) => handleDiscountChange('tier1', 'min', Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-muted-foreground">a</span>
                  <Input
                    type="number"
                    value={settings.discounts.tier1.max}
                    onChange={(e) => handleDiscountChange('tier1', 'max', Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-muted-foreground">galões =</span>
                  <Input
                    type="number"
                    value={settings.discounts.tier1.percentage}
                    onChange={(e) => handleDiscountChange('tier1', 'percentage', Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-muted-foreground">% desconto</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Faixa 2 de Desconto</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Acima de</span>
                  <Input
                    type="number"
                    value={settings.discounts.tier2.min}
                    onChange={(e) => handleDiscountChange('tier2', 'min', Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-muted-foreground">galões =</span>
                  <Input
                    type="number"
                    value={settings.discounts.tier2.percentage}
                    onChange={(e) => handleDiscountChange('tier2', 'percentage', Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-muted-foreground">% desconto</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Programa de Fidelização</CardTitle>
              <CardDescription>Recompense clientes cadastrados por compras recorrentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="loyalty-enabled"
                  checked={settings.loyalty.enabled}
                  onCheckedChange={(checked) => handleLoyaltyChange("enabled", checked as boolean)}
                />
                <Label htmlFor="loyalty-enabled" className="cursor-pointer">
                  Ativar programa de fidelização
                </Label>
              </div>
              {settings.loyalty.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="orders-required">A cada quantos pedidos?</Label>
                    <Input
                      id="orders-required"
                      type="number"
                      value={settings.loyalty.ordersRequired}
                      onChange={(e) => handleLoyaltyChange("ordersRequired", Number(e.target.value))}
                      className="w-32"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward">Recompensa</Label>
                    <Input
                      id="reward"
                      value={settings.loyalty.reward}
                      onChange={(e) => handleLoyaltyChange("reward", e.target.value)}
                      placeholder="Ex: 1 galão grátis"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ⚠️ Disponível apenas para clientes cadastrados
                  </p>
                </>
              )}
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
