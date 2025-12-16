import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, ExternalLink, Heart } from "lucide-react";
import { mockCidades, getCidadeBySlug, getDistribuidorasByCidade, getCidadeById } from "@/data/mockData";
import { Helmet } from "react-helmet-async";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CityDistributors = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const cidade = getCidadeBySlug(citySlug || "");
  
  if (!cidade) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
      </div>
    );
  }
  
  const distribuidoras = getDistribuidorasByCidade(cidade.id);
  
  const pageTitle = `Distribuidoras de Água em ${cidade.nome} - ${cidade.estado}`;
  const pageDescription = `Encontre as melhores distribuidoras de água mineral em ${cidade.nome}. Entrega rápida, preços competitivos e água de qualidade.`;

  const handleToggleFavorite = (distId: string, distName: string) => {
    const wasFavorite = isFavorite(distId);
    toggleFavorite(distId);
    
    if (wasFavorite) {
      toast.success("Removido dos favoritos", {
        description: `${distName} foi removido da sua lista.`,
      });
    } else {
      toast.success("Adicionado aos favoritos", {
        description: `${distName} foi adicionado à sua lista.`,
      });
    }
  };
  
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`água mineral ${cidade.nome}, distribuidora água ${cidade.nome}, galão água ${cidade.slug}, entrega água ${cidade.estado}`} />
        <link rel="canonical" href={`/distribuidoras/${cidade.slug}`} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary to-secondary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Distribuidoras de Água em {cidade.nome}
              </h1>
              <p className="text-xl opacity-90 mb-2">
                {cidade.estado} - {cidade.pais}
              </p>
              <p className="text-lg opacity-80">
                {distribuidoras.length} {distribuidoras.length === 1 ? 'distribuidora encontrada' : 'distribuidoras encontradas'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Distribuidoras List */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {distribuidoras.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Nenhuma distribuidora encontrada</CardTitle>
                  <CardDescription>
                    Ainda não temos distribuidoras cadastradas em {cidade.nome}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate("/")} variant="outline">
                    Ver outras cidades
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {distribuidoras.map((dist) => {
                  const cidadeInfo = getCidadeById(dist.cidade_id);
                  const now = new Date();
                  const currentDay = now.toLocaleDateString('pt-BR', { weekday: 'long' });
                  const currentTime = now.toTimeString().slice(0, 5);
                  const todayHours = dist.businessHours.find(h => 
                    h.dia_semana.toLowerCase() === currentDay.toLowerCase()
                  );
                  const isOpen = todayHours?.ativo && 
                    currentTime >= todayHours.hora_abertura && 
                    currentTime <= todayHours.hora_fechamento;
                  const favorited = isFavorite(String(dist.id));
                  
                  return (
                    <Card key={dist.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-2xl mb-2">{dist.nome}</CardTitle>
                            <CardDescription className="text-base">
                              {dist.descricao_curta}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleFavorite(String(dist.id), dist.nome)}
                              className={cn(
                                "transition-colors",
                                favorited && "text-destructive hover:text-destructive"
                              )}
                            >
                              <Heart 
                                className={cn(
                                  "h-5 w-5 transition-all",
                                  favorited && "fill-current scale-110"
                                )} 
                              />
                            </Button>
                            <Badge variant={isOpen ? "default" : "secondary"}>
                              {isOpen ? "Aberta" : "Fechada"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Address */}
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">Endereço</p>
                            <p className="text-muted-foreground">
                              {dist.rua}, {dist.numero} - {dist.bairro}
                            </p>
                            <p className="text-muted-foreground">
                              {cidadeInfo?.nome} - {cidadeInfo?.estado}, CEP: {dist.cep}
                            </p>
                          </div>
                        </div>
                        
                        {/* Contact */}
                        <div className="flex flex-wrap gap-4">
                          {dist.telefone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{dist.telefone}</span>
                            </div>
                          )}
                          {dist.email_contato && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{dist.email_contato}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Business Hours Today */}
                        {todayHours && todayHours.ativo && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              Hoje: {todayHours.hora_abertura} - {todayHours.hora_fechamento}
                            </span>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                          <Button asChild className="flex-1">
                            <Link to={`/order/${dist.slug}`}>
                              Fazer Pedido
                            </Link>
                          </Button>
                          {dist.site && (
                            <Button variant="outline" asChild>
                              <a href={dist.site} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Site
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* Other Cities Section */}
        <div className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Outras Cidades</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockCidades.filter(c => c.id !== cidade.id && c.ativo).map((c) => (
                  <Button
                    key={c.id}
                    variant="outline"
                    asChild
                    className="h-auto py-4"
                  >
                    <Link to={`/distribuidoras/${c.slug}`}>
                      <div className="text-center">
                        <p className="font-semibold">{c.nome}</p>
                        <p className="text-sm text-muted-foreground">{c.estado}</p>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CityDistributors;