import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useDistributor, useUpdateDistributor } from "@/hooks/useDistributor";

const SeoSettings = () => {
  const { data: distributor, isLoading } = useDistributor();
  const updateDistributor = useUpdateDistributor();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    if (distributor) {
      setTitle(distributor.meta_title || "");
      setDescription(distributor.meta_description || "");
      setKeywords(distributor.meta_keywords || "");
    }
  }, [distributor]);

  const handleSave = async () => {
    await updateDistributor.mutateAsync({
      meta_title: title,
      meta_description: description,
      meta_keywords: keywords,
    });
    toast.success("Informações de SEO atualizadas com sucesso!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-8">
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>SEO - AquaDelivery</title>
      </Helmet>
      <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">SEO e Descrição</h1>
          <p className="text-muted-foreground">Otimize sua página para mecanismos de busca</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações de SEO</CardTitle>
              <CardDescription>
                Configure como sua distribuidora aparece nos resultados de busca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Página</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={60}
                  placeholder="Nome da sua distribuidora - Cidade"
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/60 caracteres
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição da Empresa</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={160}
                  placeholder="Descrição breve para aparecer nos resultados de busca"
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/160 caracteres
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keywords">Palavras-chave</Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="água mineral, galão de água, entrega"
                />
                <p className="text-xs text-muted-foreground">
                  Separe as palavras-chave por vírgula
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview no Google</CardTitle>
              <CardDescription>
                Veja como sua página aparecerá nos resultados de busca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="border rounded-lg p-4 bg-background">
                <h3 className="text-xl font-medium text-blue-600 hover:underline cursor-pointer mb-1">
                  {title || "Título da página"}
                </h3>
                <p className="text-sm text-green-700 mb-2">
                  www.aguadelivery.com/distribuidoras/{distributor?.slug || "sua-distribuidora"}
                </p>
                <p className="text-sm text-gray-600">
                  {description || "Descrição da sua empresa aparecerá aqui..."}
                </p>
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
      </main>
    </div>
    </>
  );
};

export default SeoSettings;