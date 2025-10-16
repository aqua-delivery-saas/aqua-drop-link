import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const SeoSettings = () => {
  const [title, setTitle] = useState("Distribuidora Água Pura - Rio de Janeiro");
  const [description, setDescription] = useState(
    "Distribuidora de água mineral em Copacabana com entrega rápida e preços competitivos."
  );
  const [keywords, setKeywords] = useState("água mineral, galão de água, entrega de água, copacabana");

  const handleSave = () => {
    toast.success("Informações de SEO atualizadas com sucesso!");
  };

  return (
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
                  www.aguadelivery.com/distribuidoras/{title.toLowerCase().replace(/\s+/g, "-")}
                </p>
                <p className="text-sm text-gray-600">
                  {description || "Descrição da sua empresa aparecerá aqui..."}
                </p>
              </div>
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

export default SeoSettings;
