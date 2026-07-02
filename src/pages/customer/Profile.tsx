import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhone } from "@/lib/validators";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Droplets, MapPin, UserRound, Lock, LocateFixed, Loader2 } from "lucide-react";
import { UserMenu } from "@/components/customer/UserMenu";
import { CustomerBottomNav } from "@/components/customer/CustomerBottomNav";
import { CitySearchCombobox } from "@/components/CitySearchCombobox";
import { detectCityFromBrowser } from "@/lib/geoLocateCity";
import type { City } from "@/hooks/useCities";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [preferredCity, setPreferredCity] = useState<Pick<City, "id" | "name" | "state" | "slug"> | null>(null);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", newPassword: "", confirmPassword: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone, street, preferred_city_id, cities:preferred_city_id (id, name, state, slug)')
          .eq('id', user.id)
          .maybeSingle();
        if (error) throw error;
        setFormData(prev => ({
          ...prev,
          name: data?.full_name || "",
          email: user.email || "",
          phone: data?.phone || "",
          address: data?.street || "",
        }));
        setPreferredCity((data?.cities as any) || null);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        toast.error('Erro ao carregar dados do perfil');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleCitySelect = async (city: City) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ preferred_city_id: city.id })
      .eq('id', user.id);
    if (error) return toast.error("Erro ao salvar cidade");
    setPreferredCity(city);
    toast.success(`Cidade padrão: ${city.name} - ${city.state}`);
  };

  const handleUseLocation = async () => {
    setIsLocating(true);
    try {
      const city = await detectCityFromBrowser();
      await handleCitySelect(city as City);
    } catch (e: any) {
      toast.error(e?.message || "Não foi possível obter sua localização");
    } finally {
      setIsLocating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'phone') return setFormData(prev => ({ ...prev, phone: formatPhone(value) }));
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return toast.error("As senhas não coincidem!");
    }
    if (formData.newPassword && formData.newPassword.length < 6) {
      return toast.error("A nova senha deve ter no mínimo 6 caracteres!");
    }
    setIsSaving(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.name,
          phone: formData.phone,
          street: formData.address || null,
        })
        .eq('id', user.id);
      if (profileError) throw profileError;
      if (formData.newPassword) {
        const { error } = await supabase.auth.updateUser({ password: formData.newPassword });
        if (error) throw error;
      }
      toast.success("Perfil atualizado com sucesso!");
      setFormData(prev => ({ ...prev, newPassword: "", confirmPassword: "" }));
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
      toast.error(error.message || 'Erro ao salvar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center px-5">
        <div className="max-w-md w-full rounded-xl bg-card p-6 text-center shadow-[var(--shadow-soft)]">
          <p className="text-muted-foreground mb-4">Faça login para acessar seu perfil.</p>
          <Button onClick={() => navigate("/customer/login")}>Fazer Login</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Meu Perfil - AquaDelivery</title></Helmet>
      <div className="min-h-[100dvh] bg-background pb-mobile-nav">
        {/* Header */}
        <header className="flex items-center justify-between px-5 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/5">
              <Droplets className="h-6 w-6 text-primary" strokeWidth={1.8} />
            </div>
            <div className="leading-tight">
              <p className="font-display text-lg font-extrabold tracking-wide text-primary">AQUA</p>
              <p className="-mt-1 text-[10px] font-semibold tracking-[0.28em] text-accent">DELIVERY</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserMenu />
            <button
              type="button"
              aria-label="Notificações"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-[var(--shadow-soft)] transition-transform active:scale-95"
            >
              <Bell className="h-5 w-5 text-primary" strokeWidth={1.8} />
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="px-5">
          <div
            className="relative overflow-hidden rounded-2xl p-5 shadow-[var(--shadow-elevated)]"
            style={{ background: "var(--gradient-water)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                <UserRound className="h-6 w-6 text-primary-foreground" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <h1 className="truncate font-display text-xl font-bold text-primary-foreground">
                  {formData.name || 'Meu Perfil'}
                </h1>
                <p className="truncate text-xs text-primary-foreground/85">{formData.email}</p>
              </div>
            </div>
          </div>
        </section>

        {isLoading ? (
          <section className="mt-5 px-5 space-y-3">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </section>
        ) : (
          <>
            {/* Personal info */}
            <section className="mt-5 px-5">
              <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-soft)]">
                <div className="mb-3 flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold text-primary">Informações Pessoais</h2>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs">Nome Completo</Label>
                    <Input id="name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input id="email" type="email" value={formData.email} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs">Telefone</Label>
                    <Input id="phone" value={formData.phone} onChange={handleChange} placeholder="21 98765-4321" />
                  </div>
                </div>
              </div>
            </section>

            {/* Address */}
            <section className="mt-4 px-5">
              <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-soft)]">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold text-primary">Endereço de Entrega</h2>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs">Endereço Completo</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Rua das Flores, 123 - Centro"
                  />
                  <p className="text-[10px] text-muted-foreground">Ex: Rua, número, bairro, cidade - estado</p>
                </div>
              </div>
            </section>

            {/* Password */}
            <section className="mt-4 px-5">
              <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-soft)]">
                <div className="mb-1 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold text-primary">Alterar Senha</h2>
                </div>
                <p className="mb-3 text-[11px] text-muted-foreground">Deixe em branco se não desejar alterar</p>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword" className="text-xs">Nova Senha</Label>
                    <Input id="newPassword" type="password" value={formData.newPassword} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs">Confirmar Nova Senha</Label>
                    <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-5 px-5">
              <Button onClick={handleSave} className="w-full" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </section>
          </>
        )}

        <CustomerBottomNav />
      </div>
    </>
  );
};

export default Profile;
