import { useState } from 'react';
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
import { mockUsers } from '@/data/mockAdminData';
import { Search, Eye } from 'lucide-react';

export default function UserList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      admin: { label: 'Admin', className: 'bg-primary-light text-primary' },
      distributor: { label: 'Distribuidora', className: 'bg-secondary/10 text-secondary' },
      customer: { label: 'Cliente', className: 'bg-muted text-muted-foreground' },
    };
    const config = variants[role] || variants.customer;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => (
    <Badge className={isActive ? 'bg-secondary/10 text-secondary' : 'bg-destructive/10 text-destructive'}>
      {isActive ? 'Ativo' : 'Inativo'}
    </Badge>
  );

  const columns = [
    {
      header: 'Nome',
      accessor: (user: typeof mockUsers[0]) => user.full_name,
      mobileLabel: 'Nome',
    },
    {
      header: 'Email',
      accessor: (user: typeof mockUsers[0]) => user.email,
      mobileLabel: 'Email',
    },
    {
      header: 'Tipo',
      accessor: (user: typeof mockUsers[0]) => getRoleBadge(user.role),
      mobileLabel: 'Tipo',
    },
    {
      header: 'Status',
      accessor: (user: typeof mockUsers[0]) => getStatusBadge(user.is_active),
      mobileLabel: 'Status',
    },
    {
      header: 'Data de Cadastro',
      accessor: (user: typeof mockUsers[0]) => new Date(user.created_at).toLocaleDateString('pt-BR'),
      mobileLabel: 'Cadastro',
      hiddenOnMobile: true,
    },
    {
      header: 'Ações',
      accessor: (user: typeof mockUsers[0]) => (
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1 text-gray-900">Usuários</h1>
          <p className="text-body-lg text-gray-600 mt-2">
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
  );
}
