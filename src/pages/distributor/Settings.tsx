import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatPhone, formatCNPJ, formatCEP } from "@/lib/validators";
import { useDistributor, useUpdateDistributor } from "@/hooks/useDistributor";
import { supabase } from "@/integrations/supabase/client";
import { useCepLookup } from "@/hooks/useCepLookup";
import { findCityByNameAndState } from "@/hooks/useCities";

const Settings = () => {
  const { data: distributor, isLoading } = useDistributor();
  const updateDistributor = useUpdateDistributor();

  // Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { fetchAddress, isLoading: isCepLoading } = useCepLookup();

  const [settings, setSettings] = useState({
    name: "",
    slug: "",
    cnpj: "",
    whatsapp: "",
    rua: "",
    numero: "",
    bairro: "",
    cep: "",
    city: "",
    state: "",
    city_id: null as string | null,
    email_contato: "",
    telefone: "",
    pix_key: "",
    paymentMethods: {
      cash: true,
      card: true,
      pix: true,
    },
  });

  useEffect(() => {
    const loadDistributorData = async () => {
      if (distributor) {
        // Buscar nome da cidade se city_id existir
        let cityName = "";
        let stateName = "";
        
        if (distributor.city_id) {
          const { data: cityData } = await supabase
            .from('cities')
            .select('name, state')
            .eq('id', distributor.city_id)
            .single();
          
          if (cityData) {
            cityName = cityData.name;
            stateName = cityData.state;
          }
        }

        setSettings({
          name: distributor.name || "",
          slug: distributor.slug || "",
          cnpj: formatCNPJ(distributor.cnpj || ""),
          whatsapp: formatPhone(distributor.whatsapp || ""),
          rua: distributor.street || "",
          numero: distributor.number || "",
          bairro: distributor.neighborhood || "",
          cep: formatCEP(distributor.zip_code || ""),
          city: cityName,
          state: stateName,
          city_id: distributor.city_id || null,
          email_contato: distributor.email || "",
          telefone: formatPhone(distributor.phone || ""),
          pix_key: (distributor as any).pix_key || "",
          paymentMethods: {
            cash: distributor.accepts_cash ?? true,
            card: distributor.accepts_card ?? true,
            pix: distributor.accepts_pix ?? true,
          },
        });
        setLogoPreview(distributor.logo_url || null);
      }
    };
    
    loadDistributorData();
  }, [distributor]);

  const handleCepChange = async (cepValue: string) => {
    const formatted = formatCEP(cepValue);
    setSettings(prev => ({ ...prev, cep: formatted }));
    
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      const address = await fetchAddress(cleanCep);
      if (address) {
        setSettings(prev => ({
          ...prev,
          rua: address.street,
          bairro: address.neighborhood,
          city: address.city,
          state: address.state,
        }));
        
        // Buscar city_id no banco
        try {
          const existingCity = await findCityByNameAndState(address.city, address.state);
          setSettings(prev => ({ ...prev, city_id: existingCity?.id || null }));
        } catch {
          setSettings(prev => ({ ...prev, city_id: null }));
        }
      }
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Arquivo inválido", { description: "Selecione uma imagem (PNG, JPG ou WEBP)" });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Arquivo muito grande", { description: "O tamanho máximo é 2MB" });
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    // Validate required WhatsApp field
    const cleanWhatsapp = settings.whatsapp.replace(/\D/g, '');
    if (!cleanWhatsapp || cleanWhatsapp.length !== 11) {
      toast.error("WhatsApp obrigatório", { description: "Informe um número de WhatsApp válido com 11 dígitos (DDD + número)" });
      return;
    }
    if (cleanWhatsapp[2] !== '9') {
      toast.error("WhatsApp inválido", { description: "O número deve começar com 9 após o DDD" });
      return;
    }

    let logoUrl = distributor?.logo_url;

    // Upload new logo if selected
    if (logoFile) {
      setIsUploadingLogo(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) throw new Error('Usuário não autenticado');

        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('distributor-logos')
          .upload(fileName, logoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('distributor-logos')
          .getPublicUrl(fileName);

        logoUrl = publicUrl;
        setLogoFile(null);
      } catch (error) {
        console.error('Logo upload error:', error);
        toast.error("Erro no upload da logo", { description: "Tente novamente" });
        setIsUploadingLogo(false);
        return;
      }
      setIsUploadingLogo(false);
    }

    await updateDistributor.mutateAsync({
      name: settings.name,
      slug: settings.slug,
      cnpj: settings.cnpj,
      whatsapp: settings.whatsapp,
      street: settings.rua,
      number: settings.numero,
      neighborhood: settings.bairro,
      zip_code: settings.cep,
      city_id: settings.city_id,
      email: settings.email_contato,
      phone: settings.telefone,
      pix_key: settings.pix_key,
      accepts_cash: settings.paymentMethods.cash,
      accepts_card: settings.paymentMethods.card,
      accepts_pix: settings.paymentMethods.pix,
      logo_url: logoUrl,
    } as any);
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
      <div className="space-y-6 max-w-2xl mx-auto">
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
    <>
      <Helmet>
        <title>Configurações - AquaDelivery</title>
      </Helmet>
      <div className="space-y-6 max-w-2xl mx-auto">
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
            <Label>Logo da Empresa</Label>
            <div 
              className="border-2 border-dashed border-muted rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoPreview ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={logoPreview} 
                    alt="Logo da empresa" 
                    className="w-20 h-20 object-contain mb-2 rounded"
                  />
                  <p className="text-sm text-muted-foreground">Clique para alterar</p>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Adicionar logo</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP (máx 2MB)</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>

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
              onChange={(e) => {
                const formatted = formatCNPJ(e.target.value);
                setSettings({ ...settings, cnpj: formatted });
              }}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp *</Label>
              <Input
                id="whatsapp"
                value={settings.whatsapp}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setSettings({ ...settings, whatsapp: formatted });
                }}
                placeholder="(00) 90000-0000"
                maxLength={15}
                required
              />
              <p className="text-xs text-muted-foreground">
                Obrigatório para receber notificações de pedidos
              </p>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <div className="relative">
                <Input
                  id="cep"
                  value={settings.cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                />
                {isCepLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Digite o CEP para preencher automaticamente
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={settings.state}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={settings.city}
              disabled
              className="bg-muted"
            />
            {!settings.city_id && settings.city && (
              <p className="text-xs text-amber-600">
                Esta cidade ainda não está cadastrada no sistema
              </p>
            )}
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
          
          {settings.paymentMethods.pix && (
            <div className="space-y-2 pt-2 border-t mt-4">
              <Label htmlFor="pix_key">Chave PIX</Label>
              <Input
                id="pix_key"
                value={settings.pix_key}
                onChange={handleChange}
                placeholder="CPF, CNPJ, email, telefone ou chave aleatória"
              />
              <p className="text-xs text-muted-foreground">
                Será exibida para clientes que pagarem via PIX
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button 
        onClick={handleSave} 
        size="lg" 
        className="w-full"
        disabled={updateDistributor.isPending || isUploadingLogo}
      >
        {isUploadingLogo ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando logo...
          </>
        ) : updateDistributor.isPending ? (
          "Salvando..."
        ) : (
          "Salvar Alterações"
        )}
      </Button>
    </div>
    </>
  );
};

export default Settings;