import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Pencil, Trash2, Tags, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';

interface Brand {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  is_active: boolean;
  created_at: string;
  products_count: number;
}

export default function BrandList() {
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    is_active: true,
  });

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && brand.is_active) ||
      (statusFilter === 'inactive' && !brand.is_active);
    return matchesSearch && matchesStatus;
  });

  const activeBrands = brands.filter((b) => b.is_active).length;
  const inactiveBrands = brands.filter((b) => !b.is_active).length;

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
      setFormData({ name: '', description: '', logo_url: '', is_active: true });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Erro',
        description: 'O nome da marca é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    if (editingBrand) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingBrand.id
            ? { ...b, name: formData.name, description: formData.description, logo_url: formData.logo_url, is_active: formData.is_active }
            : b
        )
      );
      toast({ title: 'Marca atualizada', description: `${formData.name} foi atualizada com sucesso.` });
    } else {
      const newBrand: Brand = {
        id: `b${Date.now()}`,
        name: formData.name,
        description: formData.description,
        logo_url: formData.logo_url,
        is_active: formData.is_active,
        created_at: new Date().toISOString(),
        products_count: 0,
      };
      setBrands((prev) => [newBrand, ...prev]);
      toast({ title: 'Marca criada', description: `${formData.name} foi adicionada com sucesso.` });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (brand: Brand) => {
    setBrands((prev) => prev.filter((b) => b.id !== brand.id));
    toast({
      title: 'Marca excluída',
      description: `${brand.name} foi removida com sucesso.`,
    });
  };

  const columns = [
    {
      header: 'Logo',
      accessor: (brand: Brand) => (
        <Avatar className="h-10 w-10">
          <AvatarImage src={brand.logo_url} alt={brand.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {brand.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
      mobileLabel: 'Logo',
    },
    {
      header: 'Nome',
      accessor: 'name' as const,
      mobileLabel: 'Nome',
    },
    {
      header: 'Descrição',
      accessor: (brand: Brand) => (
        <span className="text-muted-foreground line-clamp-1">{brand.description || '-'}</span>
      ),
      mobileLabel: 'Descrição',
    },
    {
      header: 'Status',
      accessor: (brand: Brand) => (
        <Badge variant={brand.is_active ? 'default' : 'secondary'}>
          {brand.is_active ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
      mobileLabel: 'Status',
    },
    {
      header: 'Produtos',
      accessor: (brand: Brand) => <span className="font-medium">{brand.products_count}</span>,
      mobileLabel: 'Produtos',
    },
    {
      header: 'Cadastro',
      accessor: (brand: Brand) => new Date(brand.created_at).toLocaleDateString('pt-BR'),
      mobileLabel: 'Cadastro',
    },
    {
      header: 'Ações',
      accessor: (brand: Brand) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenDialog(brand); }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            }
            title="Excluir Marca"
            description={`Tem certeza que deseja excluir a marca "${brand.name}"? Esta ação não pode ser desfeita.`}
            confirmLabel="Excluir"
            onConfirm={() => handleDelete(brand)}
            variant="destructive"
          />
        </div>
      ),
      mobileLabel: 'Ações',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Marcas | Admin - Aqua Delivery</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-heading-2 font-bold text-foreground">Marcas</h1>
            <p className="text-body-md text-muted-foreground">
              Gerencie as marcas de produtos disponíveis na plataforma.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Marca
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-body-sm text-muted-foreground font-medium">
                Total de Marcas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Tags className="h-5 w-5 text-primary" />
                <span className="text-heading-3 font-bold">{brands.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-body-sm text-muted-foreground font-medium">
                Marcas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-secondary" />
                <span className="text-heading-3 font-bold">{activeBrands}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-body-sm text-muted-foreground font-medium">
                Marcas Inativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                <span className="text-heading-3 font-bold">{inactiveBrands}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <ResponsiveTable
              data={filteredBrands}
              columns={columns}
              getRowKey={(brand) => brand.id}
              emptyMessage="Nenhuma marca cadastrada. Clique em 'Adicionar Marca' para começar."
            />
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBrand ? 'Editar Marca' : 'Adicionar Marca'}</DialogTitle>
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
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição da marca (opcional)"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo_url">URL do Logo</Label>
              <div className="flex gap-3 items-center">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={formData.logo_url} alt="Preview" />
                  <AvatarFallback className="bg-muted">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://exemplo.com/logo.png"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">Cole a URL de uma imagem hospedada externamente.</p>
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingBrand ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
