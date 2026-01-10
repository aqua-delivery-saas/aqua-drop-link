import { useState } from 'react';
import { Helmet } from "react-helmet-async";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { useAdminUsers } from '@/hooks/useAdminData';
import { Search, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const { data: users, isLoading } = useAdminUsers();

  const filteredUsers = (users || []).filter((user) => {
    const matchesSearch = (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.phone || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      admin: { label: 'Admin', className: 'bg-primary/10 text-primary' },
      distributor: { label: 'Distribuidora', className: 'bg-secondary/10 text-secondary' },
      customer: { label: 'Cliente', className: 'bg-muted text-muted-foreground' },
    };
    const config = variants[role] || variants.customer;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const columns = [
    {
      header: 'Nome',
      accessor: (user: any) => user.full_name || 'Não informado',
      mobileLabel: 'Nome',
    },
    {
      header: 'Telefone',
      accessor: (user: any) => user.phone || '-',
      mobileLabel: 'Telefone',
    },
    {
      header: 'Tipo',
      accessor: (user: any) => getRoleBadge(user.role || 'customer'),
      mobileLabel: 'Tipo',
    },
    {
      header: 'Data de Cadastro',
      accessor: (user: any) => new Date(user.created_at).toLocaleDateString('pt-BR'),
      mobileLabel: 'Cadastro',
      hiddenOnMobile: true,
    },
    {
      header: 'Ações',
      accessor: (user: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/users/${user.id}`);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
      mobileLabel: 'Ver',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
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
    <>
      <Helmet>
        <title>Admin - Usuários</title>
      </Helmet>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1 text-foreground">Usuários</h1>
          <p className="text-body-lg text-muted-foreground mt-2">
            Gerencie todos os usuários do sistema
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 touch-input"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48 touch-input">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="distributor">Distribuidora</SelectItem>
            <SelectItem value="customer">Cliente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela Responsiva */}
      <ResponsiveTable
        data={filteredUsers}
        columns={columns}
        getRowKey={(user) => user.id}
        onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
        emptyMessage="Nenhum usuário encontrado"
      />
    </div>
    </>
  );
}
