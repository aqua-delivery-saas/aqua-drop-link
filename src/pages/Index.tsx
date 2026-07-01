import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Search } from "lucide-react";
import heroWater from "@/assets/hero-water.jpg";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "@/components/customer/UserMenu";
import { CustomerBottomNav } from "@/components/customer/CustomerBottomNav";
import { CitySearchCombobox } from "@/components/CitySearchCombobox";
import type { City } from "@/hooks/useCities";
const Index = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isDistributor,
    isCustomer
  } = useAuth();
  const handleCitySelect = (city: City) => {
    navigate(`/distribuidoras/${city.slug}`);
  };
  return <>
      <Helmet>
        <title>AquaDelivery - Encontre água mineral na sua cidade</title>
        <meta name="description" content="Encontre distribuidoras de água mineral perto de você. Peça água de forma rápida e simples, sem WhatsApp manual." />
        <link rel="canonical" href="https://aqua-drop-link.lovable.app/" />
        <meta property="og:title" content="AquaDelivery - Encontre água mineral na sua cidade" />
        <meta property="og:description" content="Encontre distribuidoras de água mineral perto de você. Peça água de forma rápida e simples." />
        <meta property="og:url" content="https://aqua-drop-link.lovable.app/" />
      </Helmet>

      <div className="customer-page min-h-[100dvh] relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-x-0 top-0 h-[72dvh] bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${heroWater})`
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/55 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-[100dvh] flex flex-col">
          {/* Header */}
          <header className="customer-topbar md:bg-transparent md:border-transparent md:shadow-none py-3 px-3 sm:px-6 sticky top-0 z-20">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <Logo size="md" variant="dark" />

              <div className="flex gap-1 sm:gap-2 items-center">
                {!isAuthenticated ? <>
                    <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 text-xs sm:text-sm px-2 sm:px-4" onClick={() => navigate("/distributor/login")}>
                      Sou Distribuidora
                    </Button>
                    <Button variant="outline" size="sm" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-xs sm:text-sm px-2 sm:px-4" onClick={() => navigate("/customer/login")}>
                      Sou Cliente 
                    </Button>
                  </> : isDistributor() ? <Button variant="outline" size="sm" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/distributor/dashboard")}>
                    Meu Painel
                  </Button> : <UserMenu variant="dark" />}
              </div>
            </div>
          </header>

          {/* Hero Content */}
          <main className="flex-1 flex items-center justify-center px-4 pb-mobile-nav sm:px-4">
            <div className="max-w-2xl w-full text-center animate-fade-in">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
                Encontre água mineral{" "}
                <br className="hidden sm:block" />
                <span className="text-accent">na sua cidade</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 mb-6 sm:mb-8">
                Peça água de forma rápida e simples
              </p>

              {/* Search Box */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto rounded-lg bg-card/95 p-2 shadow-[var(--shadow-elevated)] backdrop-blur-md">
                <div className="flex-1">
                  <CitySearchCombobox onSelect={handleCitySelect} />
                </div>
                <Button size="lg" variant="accent" className="h-12 sm:h-14 px-6 sm:w-auto" onClick={() => {}}>
                  <Search className="mr-2 h-5 w-5" />
                  Buscar
                </Button>
              </div>

              {/* CTA para distribuidoras */}
              <p className="mt-6 sm:mt-8 text-primary-foreground/75 text-sm sm:text-base">
                É distribuidora?{" "}
                <Button variant="link" className="p-0 h-auto sm:text-base text-lg font-bold text-accent" onClick={() => navigate("/distributor/signup")}>
                  Cadastre-se gratuitamente
                </Button>
              </p>
            </div>
          </main>

          {/* Footer mínimo */}
          <footer className="py-4 pb-24 sm:pb-4 text-center text-primary-foreground/55 text-xs sm:text-sm">
            © 2025 Aqua Delivery
          </footer>
          <CustomerBottomNav />
        </div>
      </div>
    </>;
};
export default Index;