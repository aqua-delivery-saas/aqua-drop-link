import { useState } from 'react';
import { Tags, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from '@/hooks/useBrands';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Brand {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface BrandFormData {
  name: string;
  description: string;
  logo_url: string;
  is_active: boolean;
}

export default function Brands() {
  const { user } = useAuth();
  const { data: brands, isLoading } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    description: '',
    logo_url: '',
    is_active: true,
  });

  const handleOpenDialog = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        name: brand.name,
        description: brand.description || '',
        logo_url: brand.logo_url || '',
        is_active: brand.is_active,
      });
    } else {
      setEditingBrand(null);
      setFormData({
        name: '',
        description: '',
        logo_url: '',
        is_active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingBrand) {
      await updateBrand.mutateAsync({ id: editingBrand.id, formData });
    } else {
      await createBrand.mutateAsync(formData);
    }
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (brandToDelete) {
      await deleteBrand.mutateAsync(brandToDelete);
      setDeleteDialogOpen(false);
      setBrandToDelete(null);
    }
  };

  const openDeleteDialog = (brand: Brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  // Filter brands: show all active brands + brands created by the current user
  const myBrands = brands?.filter(b => b.created_by === user?.id) || [];
  const otherBrands = brands?.filter(b => b.created_by !== user?.id && b.is_active) || [];

  const canEdit = (brand: Brand) => brand.created_by === user?.id;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Tags className="h-6 w-6" />
            Marcas
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie as marcas dos seus produtos
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Marca
        </Button>
      </div>

      {myBrands.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Minhas Marcas</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myBrands.map((brand) => (
              <Card key={brand.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    {brand.logo_url && (
                      <img 
                        src={brand.logo_url} 
                        alt={brand.name} 
                        className="h-6 w-6 object-contain rounded"
                      />
                    )}
                    {brand.name}
                  </CardTitle>
                  <Badge variant={brand.is_active ? 'default' : 'secondary'}>
                    {brand.is_active ? 'Ativa' : 'Inativa'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {brand.description || 'Sem descrição'}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(brand)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(brand)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {otherBrands.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Outras Marcas Disponíveis</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {otherBrands.map((brand) => (
              <Card key={brand.id} className="opacity-80">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    {brand.logo_url && (
                      <img 
                        src={brand.logo_url} 
                        alt={brand.name} 
                        className="h-6 w-6 object-contain rounded"
                      />
                    )}
                    {brand.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {brand.description || 'Sem descrição'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {myBrands.length === 0 && otherBrands.length === 0 && (
        <Card className="p-12 text-center">
          <Tags className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma marca cadastrada</h3>
          <p className="text-muted-foreground mb-4">
            Cadastre marcas para organizar seus produtos
          </p>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Primeira Marca
          </Button>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBrand ? 'Editar Marca' : 'Nova Marca'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome da marca"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição da marca"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo_url">URL do Logo</Label>
              <Input
                id="logo_url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Marca ativa</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!formData.name || createBrand.isPending || updateBrand.isPending}
            >
              {createBrand.isPending || updateBrand.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir marca</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a marca "{brandToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
