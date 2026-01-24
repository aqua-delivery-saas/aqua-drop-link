import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useDistributorProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, ProductWithBrand } from "@/hooks/useDistributor";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandCombobox } from "@/components/BrandCombobox";
import { useCreateBrand } from "@/hooks/useBrands";
import { useIsMobile } from "@/hooks/use-mobile";

interface SelectedBrand {
  id: string | null;
  name: string;
}

const Products = () => {
  const { data: products = [], isLoading } = useDistributorProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createBrand = useCreateBrand();
  const isMobile = useIsMobile();

  const [selectedBrand, setSelectedBrand] = useState<SelectedBrand>({ id: null, name: '' });
  const [newProduct, setNewProduct] = useState({ price: "", liters: "", available: true });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<{ 
    id: string; 
    name: string; 
    price: string; 
    liters: string; 
    available: boolean;
    brand_id: string | null;
  } | null>(null);
  const [editingBrand, setEditingBrand] = useState<SelectedBrand>({ id: null, name: '' });

  const handleAddProduct = async () => {
    if (!selectedBrand.name || !newProduct.price || !newProduct.liters) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      let brandId = selectedBrand.id;

      // Se não tem ID, significa que é uma nova marca - criar primeiro
      if (!brandId && selectedBrand.name) {
        const newBrandData = await createBrand.mutateAsync({
          name: selectedBrand.name,
          description: '',
          logo_url: '',
          is_active: true
        });
        brandId = newBrandData.id;
      }

      await createProduct.mutateAsync({
        name: selectedBrand.name,
        brand_id: brandId,
        price: parseFloat(newProduct.price),
        liters: parseFloat(newProduct.liters),
        is_available: newProduct.available,
      });

      setSelectedBrand({ id: null, name: '' });
      setNewProduct({ price: "", liters: "", available: true });
      setIsDialogOpen(false);
      setShowAddForm(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    try {
      let brandId = editingBrand.id;

      // Se mudou a marca e não tem ID, criar nova
      if (!brandId && editingBrand.name && editingBrand.name !== editingProduct.name) {
        const newBrandData = await createBrand.mutateAsync({
          name: editingBrand.name,
          description: '',
          logo_url: '',
          is_active: true
        });
        brandId = newBrandData.id;
      }

      await updateProduct.mutateAsync({
        id: editingProduct.id,
        name: editingBrand.name || editingProduct.name,
        brand_id: brandId,
        price: parseFloat(editingProduct.price),
        liters: parseFloat(editingProduct.liters),
        is_available: editingProduct.available,
      });

      setEditingProduct(null);
      setEditingBrand({ id: null, name: '' });
      setEditDialogOpen(false);
    } catch (error) {
      // Error handled by mutation
    }
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

  const openEditDialog = (product: ProductWithBrand) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      liters: product.liters.toString(),
      available: product.is_available,
      brand_id: product.brand_id,
    });
    setEditingBrand({
      id: product.brand?.id || null,
      name: product.brand?.name || product.name,
    });
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
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
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Produtos - AquaDelivery</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Produtos</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Gerencie as marcas de água disponíveis e seus preços</p>
          </div>
          {/* Mobile: Toggle inline form */}
          {isMobile ? (
            <Button 
              size="lg" 
              className="w-full"
              variant={showAddForm ? "outline" : "default"}
              onClick={() => {
                setShowAddForm(!showAddForm);
                if (showAddForm) {
                  setSelectedBrand({ id: null, name: '' });
                  setNewProduct({ price: "", liters: "", available: true });
                }
              }}
            >
              {showAddForm ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Produto
                </>
              )}
            </Button>
          ) : (
            /* Desktop: Keep ResponsiveDialog */
            <ResponsiveDialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setSelectedBrand({ id: null, name: '' });
                setNewProduct({ price: "", liters: "", available: true });
              }
            }}>
              <ResponsiveDialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Produto
                </Button>
              </ResponsiveDialogTrigger>
              <ResponsiveDialogContent>
                <ResponsiveDialogHeader>
                  <ResponsiveDialogTitle>Adicionar Produto</ResponsiveDialogTitle>
                  <ResponsiveDialogDescription>
                    Selecione uma marca existente ou crie uma nova
                  </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Marca</Label>
                    <BrandCombobox
                      value={selectedBrand.name}
                      selectedBrandId={selectedBrand.id}
                      onChange={(brandName, brand) => {
                        setSelectedBrand({
                          id: brand?.id || null,
                          name: brandName
                        });
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Digite para buscar ou criar uma nova marca
                    </p>
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
                    disabled={createProduct.isPending || createBrand.isPending}
                  >
                    {(createProduct.isPending || createBrand.isPending) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Salvar Produto
                  </Button>
                </div>
              </ResponsiveDialogContent>
            </ResponsiveDialog>
          )}
        </div>

        {/* Mobile: Inline Add Form */}
        {isMobile && showAddForm && (
          <Card className="animate-fade-in border-primary/50">
            <CardHeader>
              <CardTitle className="text-lg">Adicionar Produto</CardTitle>
              <CardDescription>
                Selecione uma marca existente ou crie uma nova
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Marca</Label>
                <BrandCombobox
                  value={selectedBrand.name}
                  selectedBrandId={selectedBrand.id}
                  onChange={(brandName, brand) => {
                    setSelectedBrand({
                      id: brand?.id || null,
                      name: brandName
                    });
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Digite para buscar ou criar uma nova marca
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileProductLiters">Litros</Label>
                <Input
                  id="mobileProductLiters"
                  type="number"
                  step="0.5"
                  placeholder="20"
                  value={newProduct.liters}
                  onChange={(e) => setNewProduct({ ...newProduct, liters: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileProductPrice">Preço (R$)</Label>
                <Input
                  id="mobileProductPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="mobileProductAvailable"
                  checked={newProduct.available}
                  onCheckedChange={(checked) => setNewProduct({ ...newProduct, available: checked })}
                />
                <Label htmlFor="mobileProductAvailable">Disponível</Label>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedBrand({ id: null, name: '' });
                    setNewProduct({ price: "", liters: "", available: true });
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddProduct} 
                  className="flex-1"
                  disabled={createProduct.isPending || createBrand.isPending}
                >
                  {(createProduct.isPending || createBrand.isPending) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className={!product.is_available ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {product.brand?.logo_url && (
                        <img 
                          src={product.brand.logo_url} 
                          alt="" 
                          className="h-6 w-6 object-contain rounded"
                        />
                      )}
                      <CardTitle className="text-lg">{product.brand?.name || product.name}</CardTitle>
                    </div>
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openEditDialog(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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

        {/* Edit Product Dialog */}
        <ResponsiveDialog open={editDialogOpen} onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setEditingProduct(null);
            setEditingBrand({ id: null, name: '' });
          }
        }}>
          <ResponsiveDialogContent>
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Editar Produto</ResponsiveDialogTitle>
            </ResponsiveDialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Marca</Label>
                <BrandCombobox
                  value={editingBrand.name}
                  selectedBrandId={editingBrand.id}
                  onChange={(brandName, brand) => {
                    setEditingBrand({
                      id: brand?.id || null,
                      name: brandName
                    });
                  }}
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
                disabled={updateProduct.isPending || createBrand.isPending}
              >
                {(updateProduct.isPending || createBrand.isPending) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Salvar Alterações
              </Button>
            </div>
          </ResponsiveDialogContent>
        </ResponsiveDialog>

        {products.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">Nenhum produto cadastrado ainda.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Produto
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default Products;
