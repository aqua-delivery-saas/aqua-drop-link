import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Search } from "lucide-react";
import heroWater from "@/assets/hero-water.jpg";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "@/components/customer/UserMenu";
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
        <meta name="description" content="Encontre distribuidoras de água mineral perto de você. Peça água de forma rápida e simples." />
      </Helmet>

      <div className="min-h-[100dvh] relative overflow-hidden">
        {/* Background Image */}
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${heroWater})`
      }}>
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-[100dvh] flex flex-col">
          {/* Header */}
          <header className="py-4 px-3 sm:px-6">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <Logo size="md" variant="dark" />

              <div className="flex gap-1 sm:gap-2 items-center">
                {!isAuthenticated ? <>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs sm:text-sm px-2 sm:px-4" onClick={() => navigate("/distributor/login")}>
                      Sou Distribuidora
                    </Button>
                    <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 text-xs sm:text-sm px-2 sm:px-4" onClick={() => navigate("/customer/login")}>
                      Sou Cliente 
                    </Button>
                  </> : isDistributor() ? <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10" onClick={() => navigate("/distributor/dashboard")}>
                    Meu Painel
                  </Button> : <UserMenu variant="dark" />}
              </div>
            </div>
          </header>

          {/* Hero Content */}
          <main className="flex-1 flex items-center justify-center px-3 sm:px-4">
            <div className="max-w-2xl w-full text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Encontre água mineral{" "}
                <br className="hidden sm:block" />
                <span className="text-primary">na sua cidade</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8">
                Peça água de forma rápida e simples
              </p>

              {/* Search Box */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <div className="flex-1">
                  <CitySearchCombobox onSelect={handleCitySelect} />
                </div>
                <Button size="lg" className="h-12 sm:h-14 px-6 sm:w-auto" onClick={() => {}}>
                  <Search className="mr-2 h-5 w-5" />
                  Buscar
                </Button>
              </div>

              {/* CTA para distribuidoras */}
              <p className="mt-6 sm:mt-8 text-white/70 text-sm sm:text-base">
                É distribuidora?{" "}
                <Button variant="link" className="p-0 h-auto sm:text-base text-lg font-bold text-primary-foreground" onClick={() => navigate("/distributor/signup")}>
                  Cadastre-se gratuitamente
                </Button>
              </p>
            </div>
          </main>

          {/* Footer mínimo */}
          <footer className="py-4 text-center text-white/50 text-xs sm:text-sm">
            © 2025 Aqua Delivery
          </footer>
        </div>
      </div>
    </>;
};
export default Index;