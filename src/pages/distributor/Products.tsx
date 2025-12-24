import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDistributorProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useDistributor";
import { Skeleton } from "@/components/ui/skeleton";

const Products = () => {
  const { data: products = [], isLoading } = useDistributorProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [newProduct, setNewProduct] = useState({ name: "", price: "", liters: "", available: true });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<{ id: string; name: string; price: string; liters: string; available: boolean } | null>(null);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.liters) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    await createProduct.mutateAsync({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      liters: parseFloat(newProduct.liters),
      is_available: newProduct.available,
    });

    setNewProduct({ name: "", price: "", liters: "", available: true });
    setIsDialogOpen(false);
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    await updateProduct.mutateAsync({
      id: editingProduct.id,
      name: editingProduct.name,
      price: parseFloat(editingProduct.price),
      liters: parseFloat(editingProduct.liters),
      is_available: editingProduct.available,
    });

    setEditingProduct(null);
  };

  const toggleAvailability = async (id: string, currentAvailable: boolean) => {
    await updateProduct.mutateAsync({
      id,
      is_available: !currentAvailable,
    });
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Marcas e Preços</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Gerencie as marcas de água disponíveis</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full sm:w-auto">
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
                  <Label htmlFor="productLiters">Litros</Label>
                  <Input
                    id="productLiters"
                    type="number"
                    step="0.5"
                    placeholder="20"
                    value={newProduct.liters}
                    onChange={(e) => setNewProduct({ ...newProduct, liters: e.target.value })}
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
                <Button 
                  onClick={handleAddProduct} 
                  className="w-full"
                  disabled={createProduct.isPending}
                >
                  {createProduct.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Salvar Marca
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className={!product.is_available ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {Number(product.liters)}L
                    </CardDescription>
                    <CardDescription>
                      <span className="text-2xl font-bold text-primary">
                        R$ {Number(product.price).toFixed(2)}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setEditingProduct({
                            id: product.id,
                            name: product.name,
                            price: product.price.toString(),
                            liters: product.liters.toString(),
                            available: product.is_available,
                          })}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Marca</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Nome da Marca</Label>
                            <Input
                              value={editingProduct?.name || ""}
                              onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Litros</Label>
                            <Input
                              type="number"
                              step="0.5"
                              value={editingProduct?.liters || ""}
                              onChange={(e) => setEditingProduct(prev => prev ? { ...prev, liters: e.target.value } : null)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Preço (R$)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={editingProduct?.price || ""}
                              onChange={(e) => setEditingProduct(prev => prev ? { ...prev, price: e.target.value } : null)}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={editingProduct?.available || false}
                              onCheckedChange={(checked) => setEditingProduct(prev => prev ? { ...prev, available: checked } : null)}
                            />
                            <Label>Disponível</Label>
                          </div>
                          <Button 
                            onClick={handleEditProduct} 
                            className="w-full"
                            disabled={updateProduct.isPending}
                          >
                            {updateProduct.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Salvar Alterações
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={deleteProduct.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {product.is_available ? "Disponível" : "Indisponível"}
                  </span>
                  <Switch
                    checked={product.is_available}
                    onCheckedChange={() => toggleAvailability(product.id, product.is_available)}
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
