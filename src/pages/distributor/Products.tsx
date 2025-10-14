import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Água Mineral Crystal", price: 8.50, available: true },
    { id: "2", name: "Água Mineral Indaiá", price: 9.00, available: true },
    { id: "3", name: "Água Mineral São Lourenço", price: 7.50, available: true },
    { id: "4", name: "Água Mineral Minalba", price: 8.00, available: false },
    { id: "5", name: "Água Mineral Bonafont", price: 9.50, available: true },
  ]);

  const [newProduct, setNewProduct] = useState({ name: "", price: "", available: true });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      available: newProduct.available,
    };

    setProducts([...products, product]);
    setNewProduct({ name: "", price: "", available: true });
    setIsDialogOpen(false);
    toast.success("Marca cadastrada com sucesso!");
  };

  const toggleAvailability = (id: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, available: !p.available } : p
    ));
    toast.success("Disponibilidade atualizada");
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Marca removida");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Marcas e Preços</h1>
            <p className="text-muted-foreground">Gerencie as marcas de água disponíveis</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Nova Marca
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Marca</DialogTitle>
                <DialogDescription>Adicione uma nova marca de água ao seu catálogo</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Nome da Marca</Label>
                  <Input
                    id="productName"
                    placeholder="Ex: Água Mineral Crystal"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productPrice">Preço (R$)</Label>
                  <Input
                    id="productPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="productAvailable"
                    checked={newProduct.available}
                    onCheckedChange={(checked) => setNewProduct({ ...newProduct, available: checked })}
                  />
                  <Label htmlFor="productAvailable">Disponível</Label>
                </div>
                <Button onClick={handleAddProduct} className="w-full">
                  Salvar Marca
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className={!product.available ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>
                      <span className="text-2xl font-bold text-primary">
                        R$ {product.price.toFixed(2)}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toast.info("Função de edição em breve")}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {product.available ? "Disponível" : "Indisponível"}
                  </span>
                  <Switch
                    checked={product.available}
                    onCheckedChange={() => toggleAvailability(product.id)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">Nenhuma marca cadastrada ainda.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeira Marca
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Products;
