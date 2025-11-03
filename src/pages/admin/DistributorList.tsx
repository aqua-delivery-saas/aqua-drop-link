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
import { mockDistributors } from '@/data/mockAdminData';
import { Search, Eye } from 'lucide-react';

export default function DistributorList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDistributors = mockDistributors.filter((dist) => {
    const matchesSearch = dist.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dist.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dist.subscription_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      active: { label: 'Ativo', className: 'bg-accent-green/10 text-accent-green' },
      expiring_soon: { label: 'Vence em breve', className: 'bg-primary-100 text-primary' },
      expired: { label: 'Vencido', className: 'bg-accent-red/10 text-accent-red' },
      canceled: { label: 'Cancelado', className: 'bg-gray-100 text-gray-600' },
    };
    const config = variants[status] || variants.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1 text-gray-900">Distribuidoras</h1>
          <p className="text-body-lg text-gray-600 mt-2">
            Gerencie as distribuidoras cadastradas
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
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
            <SelectItem value="expiring_soon">Vence em breve</SelectItem>
            <SelectItem value="expired">Vencido</SelectItem>
            <SelectItem value="canceled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Cidade/Estado</TableHead>
              <TableHead>Status Assinatura</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDistributors.map((dist) => (
              <TableRow key={dist.id}>
                <TableCell className="font-medium">{dist.company_name}</TableCell>
                <TableCell>{dist.cnpj}</TableCell>
                <TableCell>{dist.city}/{dist.state}</TableCell>
                <TableCell>{getStatusBadge(dist.subscription_status)}</TableCell>
                <TableCell>
                  {new Date(dist.subscription_expires_at).toLocaleDateString('pt-BR')}
                </TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredDistributors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-body-lg text-gray-600">Nenhuma distribuidora encontrada</p>
        </div>
      )}
    </div>
  );
}
