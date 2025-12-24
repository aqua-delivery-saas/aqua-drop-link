import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminDistributors } from '@/hooks/useAdminData';
import { Search, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DistributorList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: distributors, isLoading } = useAdminDistributors();

  const filteredDistributors = (distributors || []).filter((dist) => {
    const cityName = (dist.cities as any)?.name || '';
    const matchesSearch = dist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && dist.is_active) ||
                         (statusFilter === 'inactive' && !dist.is_active);
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge className="bg-accent-green/10 text-accent-green">Ativo</Badge>;
    }
    return <Badge className="bg-accent-red/10 text-accent-red">Inativo</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1 text-foreground">Distribuidoras</h1>
          <p className="text-body-lg text-muted-foreground mt-2">
            Gerencie as distribuidoras cadastradas
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Cidade/Estado</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDistributors.map((dist) => {
              const city = dist.cities as any;
              return (
              <TableRow key={dist.id}>
                <TableCell className="font-medium">{dist.name}</TableCell>
                <TableCell>{dist.cnpj || '-'}</TableCell>
                <TableCell>
                  {city ? `${city.name}/${city.state}` : '-'}
                </TableCell>
                <TableCell>{getStatusBadge(dist.is_active)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/admin/users/${dist.user_id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filteredDistributors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-body-lg text-muted-foreground">Nenhuma distribuidora encontrada</p>
        </div>
      )}
    </div>
  );
}
