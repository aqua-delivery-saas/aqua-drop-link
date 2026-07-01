import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Bell, MapPin, ChevronRight, ShieldCheck, Truck, CreditCard, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "@/components/customer/UserMenu";
import { CustomerBottomNav } from "@/components/customer/CustomerBottomNav";
import { CitySearchCombobox } from "@/components/CitySearchCombobox";
import type { City } from "@/hooks/useCities";
import gallonHero from "@/assets/gallon-hero.png";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isDistributor } = useAuth();

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
          </div>
        </header>

        {/* Address / Search card */}
        <section className="px-5">
          <div className="flex items-center gap-3 rounded-xl bg-card p-3.5 shadow-[var(--shadow-soft)]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
              <MapPin className="h-5 w-5 text-primary" strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-muted-foreground">Entrega para</p>
              <div className="[&_button]:!h-auto [&_button]:!border-0 [&_button]:!bg-transparent [&_button]:!p-0 [&_button]:!shadow-none [&_button]:!text-[15px] [&_button]:!font-semibold [&_button]:!text-primary">
                <CitySearchCombobox onSelect={handleCitySelect} />
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </div>
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

        {/* Products section (teaser to search) */}
        <section className="mt-6 px-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-bold text-primary">Nossos produtos</h2>
            <button
              type="button"
              onClick={() => navigate("/distribuidoras")}
              className="text-xs font-semibold text-accent hover:underline"
            >
              Ver todos
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {[
              { label: "Mais pedido", price: "R$ 18,00" },
              { label: null, price: "R$ 18,00" },
              { label: null, price: "R$ 18,00" },
            ].map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => navigate("/distribuidoras")}
                className="relative flex flex-col rounded-xl bg-card p-3 text-left shadow-[var(--shadow-soft)] transition-transform active:scale-[0.98]"
              >
                {p.label && (
                  <span className="absolute left-2 top-2 rounded-md bg-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                    {p.label}
                  </span>
                )}
                <div className="flex h-20 items-center justify-center">
                  <img src={gallonHero} alt="Galão 20L" className="h-20 w-auto object-contain" loading="lazy" />
                </div>
                <p className="mt-2 text-[13px] font-bold text-primary">Galão 20L</p>
                <p className="text-[10px] text-muted-foreground">Água Mineral Natural</p>
                <p className="mt-1 text-xs font-bold text-primary">{p.price}</p>
                <span className="mt-2 flex h-8 items-center justify-center gap-1 rounded-lg bg-primary text-[11px] font-semibold text-primary-foreground">
                  Pedir
                </span>
              </button>
            ))}
          </div>
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
