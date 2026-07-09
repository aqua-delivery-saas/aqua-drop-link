import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Bell, MapPin, ChevronRight, ShieldCheck, Truck, CreditCard, Droplets, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "@/components/customer/UserMenu";
import { CustomerBottomNav } from "@/components/customer/CustomerBottomNav";
import { CitySearchCombobox } from "@/components/CitySearchCombobox";
import type { City } from "@/hooks/useCities";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import gallonHero from "@/assets/gallon-hero.png";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isDistributor, user } = useAuth();
  const [preferredCity, setPreferredCity] = useState<Pick<City, "id" | "name" | "state" | "slug"> | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      setPreferredCity(null);
      setRecentOrders([]);
      return;
    }
    (async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("cities:preferred_city_id (id, name, state, slug)")
        .eq("id", user.id)
        .maybeSingle();
      setPreferredCity((profile?.cities as any) || null);

      const { data: orders } = await supabase
        .from("orders")
        .select("id, order_number, total, status, created_at, order_items (product_name), distributors:distributor_id (slug, name)")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
      setRecentOrders(orders || []);
    })();
  }, [user]);

  const handleCitySelect = (city: City) => {
    navigate(`/distribuidoras/${city.slug}`);
  };

  return (
    <>
      <Helmet>
        <title>AquaDelivery - Encontre água mineral na sua cidade</title>
        <meta name="description" content="Encontre distribuidoras de água mineral perto de você. Peça água de forma rápida e simples, sem WhatsApp manual." />
        <link rel="canonical" href="https://aqua-drop-link.lovable.app/" />
        <meta property="og:title" content="AquaDelivery - Encontre água mineral na sua cidade" />
        <meta property="og:description" content="Encontre distribuidoras de água mineral perto de você. Peça água de forma rápida e simples." />
        <meta property="og:url" content="https://aqua-drop-link.lovable.app/" />
      </Helmet>

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
            <button
              type="button"
              aria-label="Notificações"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-[var(--shadow-soft)] transition-transform active:scale-95"
            >
              <Bell className="h-5 w-5 text-primary" strokeWidth={1.8} />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-primary">
                2
              </span>
            </button>
            {isAuthenticated ? (
              isDistributor() ? (
                <Button variant="ghost" size="sm" onClick={() => navigate("/distributor/dashboard")}>
                  Painel
                </Button>
              ) : (
                <UserMenu />
              )
            ) : (
              <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate("/customer/login")}>
                Entrar
              </Button>
            )}
          </div>
        </header>

        {/* Address / Search card */}
        <section className="px-5">
          <button
            type="button"
            onClick={() => preferredCity && navigate(`/distribuidoras/${preferredCity.slug}`)}
            className="flex w-full items-center gap-3 rounded-xl bg-card p-3.5 text-left shadow-[var(--shadow-soft)] transition-transform active:scale-[0.99]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
              <MapPin className="h-5 w-5 text-primary" strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1" onClick={(e) => e.stopPropagation()}>
              <p className="text-[11px] font-medium text-muted-foreground">
                {preferredCity ? "Sua cidade" : "Entrega para"}
              </p>
              <div className="[&_button]:!h-auto [&_button]:!border-0 [&_button]:!bg-transparent [&_button]:!p-0 [&_button]:!shadow-none [&_button]:!text-[15px] [&_button]:!font-semibold [&_button]:!text-primary">
                <CitySearchCombobox
                  onSelect={handleCitySelect}
                  selectedCity={preferredCity}
                  placeholder="Digite sua cidade..."
                />
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </button>
        </section>

        {/* Promo hero */}
        <section className="mt-5 px-5">
          <div
            className="relative overflow-hidden rounded-2xl p-5 shadow-[var(--shadow-elevated)]"
            style={{ background: "var(--gradient-water)" }}
          >
            <div className="relative z-10 max-w-[62%]">
              <h1 className="font-display text-[22px] font-bold leading-tight text-primary-foreground">
                Água pura,
                <br /> qualidade que
                <br /> você sente!
              </h1>
              <div className="mt-4 flex items-start gap-2">
                <Droplets className="h-4 w-4 shrink-0 text-accent" />
                <p className="text-xs leading-snug text-primary-foreground/85">
                  Hidratação e bem-estar
                  <br /> todos os dias.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5">
                <span className="h-1.5 w-5 rounded-full bg-accent" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/40" />
              </div>
            </div>
            <img
              src={gallonHero}
              alt="Galão AQUA DELIVERY 20 litros"
              className="absolute -right-3 top-1/2 h-[190px] w-auto -translate-y-1/2 drop-shadow-2xl"
              width={768}
              height={768}
            />
          </div>
        </section>

        {/* Últimos pedidos */}
        <section className="mt-6 px-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-bold text-primary">Últimos pedidos</h2>
            {isAuthenticated && recentOrders.length > 0 && (
              <button
                type="button"
                onClick={() => navigate("/customer/history")}
                className="text-xs font-semibold text-accent hover:underline"
              >
                Ver todos
              </button>
            )}
          </div>

          {!isAuthenticated ? (
            <div className="mt-3 rounded-xl bg-card p-4 text-center shadow-[var(--shadow-soft)]">
              <p className="text-xs text-muted-foreground">
                Entre na sua conta para ver seus últimos pedidos.
              </p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => navigate("/customer/login")}
              >
                Entrar
              </Button>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="mt-3 rounded-xl bg-card p-4 text-center shadow-[var(--shadow-soft)]">
              <p className="text-xs text-muted-foreground">
                Você ainda não fez pedidos. Escolha uma cidade acima para começar.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {recentOrders.map((o) => {
                const first = o.order_items?.[0]?.product_name || "Pedido";
                const more = (o.order_items?.length || 0) - 1;
                const distSlug = (o.distributors as any)?.slug;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => distSlug && navigate(`/order/${distSlug}`)}
                    className="flex w-full items-center gap-3 rounded-xl bg-card p-3 text-left shadow-[var(--shadow-soft)] transition-transform active:scale-[0.99]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                      <ClipboardList className="h-5 w-5 text-primary" strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-primary">
                        {more > 0 ? `${first} +${more}` : first}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        #{o.order_number} • {format(new Date(o.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      R$ {Number(o.total).toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Trust bar */}
        <section className="mt-6 px-5">
          <div className="grid grid-cols-3 divide-x divide-border rounded-xl bg-card p-3 shadow-[var(--shadow-soft)]">
            {[
              { icon: ShieldCheck, title: "Qualidade garantida", sub: "Água 100% pura" },
              { icon: Truck, title: "Entrega rápida", sub: "No mesmo dia" },
              { icon: CreditCard, title: "Pagamento seguro", sub: "Diversas formas" },
            ].map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-1 px-2 text-center">
                <t.icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
                <p className="text-[10px] font-bold leading-tight text-primary">{t.title}</p>
                <p className="text-[9px] leading-tight text-muted-foreground">{t.sub}</p>
              </div>
            ))}
          </div>
        </section>


        {/* Signup nudge */}
        {!isAuthenticated && (
          <section className="mt-6 px-5 text-center">
            <p className="text-xs text-muted-foreground">
              É distribuidora?{" "}
              <Button
                variant="link"
                className="h-auto p-0 text-xs font-bold text-accent"
                onClick={() => navigate("/distributor/signup")}
              >
                Cadastre-se gratuitamente
              </Button>
            </p>
          </section>
        )}

        <footer className="mt-6 pb-6 text-center text-[10px] text-muted-foreground">
          © 2025 Aqua Delivery
        </footer>

        <CustomerBottomNav />
      </div>
    </>
  );
};

export default Index;
