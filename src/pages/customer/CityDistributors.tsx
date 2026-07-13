import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Heart } from "lucide-react";
import { Droplets } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCityBySlug, useDistributorsByCity, useCities } from "@/hooks/useCities";
import { Skeleton } from "@/components/ui/skeleton";
import { isDistributorOpen } from "@/lib/businessHoursUtils";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/customer/UserMenu";
import { CustomerBottomNav } from "@/components/customer/CustomerBottomNav";
const CityDistributors = () => {
  const {
    citySlug
  } = useParams<{
    citySlug: string;
  }>();
  const navigate = useNavigate();
  const {
    toggleFavorite,
    isFavorite
  } = useFavorites();
  const {
    data: cidade,
    isLoading: cityLoading
  } = useCityBySlug(citySlug || "");
  const {
    data: distribuidoras,
    isLoading: distributorsLoading
  } = useDistributorsByCity(cidade?.id || "");
  const {
    data: allCities
  } = useCities();
  const isLoading = cityLoading || distributorsLoading;
  if (isLoading) {
    return <div className="customer-page min-h-screen pb-mobile-nav">
        <div className="customer-hero py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Skeleton className="h-12 w-96 mx-auto mb-4 bg-primary-foreground/20" />
              <Skeleton className="h-6 w-48 mx-auto bg-primary-foreground/20" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto space-y-6">
            {[...Array(3)].map((_, i) => <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>;
  }
  if (!cidade) {
    return <div className="customer-page min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Cidade não encontrada</CardTitle>
            <CardDescription>A cidade que você procura não está disponível no momento.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>;
  }
  const pageTitle = `Distribuidoras de Água em ${cidade.name} - ${cidade.state}`;
  const pageDescription = `Encontre as melhores distribuidoras de água mineral em ${cidade.name}. Entrega rápida, preços competitivos e água de qualidade.`;
  const handleToggleFavorite = (distId: string, distName: string) => {
    const wasFavorite = isFavorite(distId);
    toggleFavorite(distId);
    if (wasFavorite) {
      toast.success("Removido dos favoritos", {
        description: `${distName} foi removido da sua lista.`
      });
    } else {
      toast.success("Adicionado aos favoritos", {
        description: `${distName} foi adicionado à sua lista.`
      });
    }
  };
  const otherCities = (allCities || []).filter(c => c.id !== cidade.id && c.is_active);
  return <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`água mineral ${cidade.name}, distribuidora água ${cidade.name}, galão água ${cidade.slug}, entrega água ${cidade.state}`} />
        <link rel="canonical" href={`/distribuidoras/${cidade.slug}`} />
      </Helmet>
      
      <div className="customer-page min-h-screen pb-mobile-nav">
        <header className="customer-topbar sticky top-0 z-20">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Logo size="md" />
            <UserMenu />
          </div>
        </header>
        {/* Hero Section */}
        <div className="customer-hero rounded-b-[2rem] py-8 sm:py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
                Distribuidoras de Água em {cidade.name}
              </h1>
              <p className="text-xl opacity-90 mb-2">
                {cidade.state} - {cidade.country}
              </p>
              <p className="text-lg opacity-80">
                {(distribuidoras || []).length} {(distribuidoras || []).length === 1 ? 'distribuidora encontrada' : 'distribuidoras encontradas'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Distribuidoras List */}
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto">
            {(distribuidoras || []).length === 0 ? <Card className="customer-card">
                <CardHeader>
                  <CardTitle>Nenhuma distribuidora encontrada</CardTitle>
                  <CardDescription>
                    Ainda não temos distribuidoras cadastradas em {cidade.name}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate("/")} variant="outline">
                    Ver outras cidades
                  </Button>
                </CardContent>
              </Card> : <div className="space-y-4 sm:space-y-6">
                {(distribuidoras || []).map(dist => {
              const favorited = isFavorite(dist.id);
              const open = isDistributorOpen(dist.business_hours);
              return <Card key={dist.id} className="customer-card water-press overflow-hidden">
                      <CardHeader className="p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 flex-1 gap-3">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary-light">
                              {dist.logo_url ? <img src={dist.logo_url} alt={`Logo ${dist.name}`} className="h-full w-full object-cover" loading="lazy" /> : <Droplets className="h-7 w-7 text-primary" />}
                            </div>
                            <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <CardTitle className="text-xl sm:text-2xl leading-tight">{dist.name}</CardTitle>
                              <Badge 
                                variant="secondary"
                                className={cn(
                                  "flex items-center gap-1 rounded-lg",
                                  open ? "status-open" : "status-closed"
                                )}
                              >
                                <Clock className="h-3 w-3" />
                                {open ? "Aberta" : "Fechada"}
                              </Badge>
                            </div>
                            <CardDescription className="text-base">
                              {dist.meta_description || 'Distribuidora de água mineral'}
                            </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button variant="ghost" size="icon" aria-label={favorited ? `Remover ${dist.name} dos favoritos` : `Adicionar ${dist.name} aos favoritos`} onClick={() => handleToggleFavorite(dist.id, dist.name)} className={cn("transition-colors", favorited && "text-destructive hover:text-destructive")}>
                              <Heart className={cn("h-5 w-5 transition-all", favorited && "fill-current scale-110")} />
                            </Button>
                            
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
                        {/* Address */}
                        {dist.street && <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">Endereço</p>
                              <p className="text-muted-foreground">
                                {dist.street}, {dist.number} - {dist.neighborhood}
                              </p>
                              <p className="text-muted-foreground">
                                {cidade.name} - {cidade.state}, CEP: {dist.zip_code}
                              </p>
                            </div>
                          </div>}
                        
                        {/* Contact - WhatsApp is displayed publicly */}
                        {dist.whatsapp && <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{dist.whatsapp}</span>
                          </div>}
                        
                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                          <Button asChild className="flex-1">
                            <Link to={`/order/${dist.slug}`}>
                              Fazer Pedido
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>;
            })}
              </div>}
          </div>
        </div>
        
        {/* Other Cities Section */}
        {otherCities.length > 0 && <div className="py-10 sm:py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Outras Cidades</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {otherCities.slice(0, 8).map(c => <Button key={c.id} variant="outline" asChild className="h-auto py-4">
                      <Link to={`/distribuidoras/${c.slug}`}>
                        <div className="text-center">
                          <p className="font-semibold">{c.name}</p>
                          <p className="text-sm text-muted-foreground">{c.state}</p>
                        </div>
                      </Link>
                    </Button>)}
                </div>
              </div>
            </div>
          </div>}
      </div>
      <CustomerBottomNav />
    </>;
};
export default CityDistributors;