import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { mockUsers } from '@/data/mockAdminData';
import { ArrowLeft, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = mockUsers.find((u) => u.id === id);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-body-lg text-gray-600">Usuário não encontrado</p>
        <Button onClick={() => navigate('/admin/users')} className="mt-4">
          Voltar para lista
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    toast.success('Alterações salvas com sucesso!', {
      description: 'Os dados do usuário foram atualizados.',
      duration: 3000,
    });
  };

  const handleResetPassword = () => {
    toast.success('Email enviado!', {
      description: `Um link de recuperação foi enviado para ${user.email}`,
      duration: 4000,
    });
  };

  const handleToggleStatus = () => {
    const newStatus = !user.is_active;
    toast.success(
      `Usuário ${newStatus ? 'ativado' : 'desativado'}!`,
      {
        description: newStatus 
          ? 'O usuário agora pode acessar o sistema.' 
          : 'O usuário não poderá mais acessar o sistema.',
        duration: 3000,
        action: {
          label: 'Desfazer',
          onClick: () => toast.info('Ação desfeita'),
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/users')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1 text-gray-900">{user.full_name}</h1>
          <p className="text-body-lg text-gray-600 mt-2">{user.email}</p>
        </div>
        <Badge className={user.is_active ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}>
          {user.is_active ? 'Ativo' : 'Inativo'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card className="border-gray-300">
          <CardHeader>
            <CardTitle className="text-heading-3 text-gray-900">
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-body-sm text-gray-600">Nome Completo</Label>
              <Input defaultValue={user.full_name} className="mt-1" />
            </div>

            <div>
              <Label className="text-body-sm text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input defaultValue={user.email} className="mt-1" disabled />
            </div>

            {user.phone && (
              <div>
                <Label className="text-body-sm text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone
                </Label>
                <Input defaultValue={user.phone} className="mt-1" />
              </div>
            )}

            {user.city && user.state && (
              <div>
                <Label className="text-body-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Localização
                </Label>
                <Input defaultValue={`${user.city} - ${user.state}`} className="mt-1" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configurações de Acesso */}
        <Card className="border-gray-300">
          <CardHeader>
            <CardTitle className="text-heading-3 text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Configurações de Acesso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-body-sm text-gray-600">Tipo de Usuário</Label>
              <Select defaultValue={user.role}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="distributor">Distribuidora</SelectItem>
                  <SelectItem value="customer">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-body-sm text-gray-600">Data de Cadastro</Label>
              <Input 
                value={new Date(user.created_at).toLocaleDateString('pt-BR')} 
                className="mt-1" 
                disabled 
              />
            </div>

            <div className="space-y-2 pt-4">
              <Button variant="outline" className="w-full touch-input" onClick={handleResetPassword}>
                Enviar Email de Recuperação
              </Button>
              <ConfirmDialog
                trigger={
                  <Button 
                    variant="outline" 
                    className="w-full touch-input"
                  >
                    {user.is_active ? 'Desativar Conta' : 'Reativar Conta'}
                  </Button>
                }
                title={user.is_active ? 'Desativar conta?' : 'Reativar conta?'}
                description={
                  user.is_active 
                    ? 'O usuário não poderá mais acessar o sistema até que a conta seja reativada.' 
                    : 'O usuário voltará a ter acesso ao sistema.'
                }
                confirmLabel={user.is_active ? 'Desativar' : 'Reativar'}
                variant={user.is_active ? 'destructive' : 'default'}
                onConfirm={handleToggleStatus}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleSave} className="touch-input">Salvar Alterações</Button>
        <Button variant="outline" onClick={() => navigate('/admin/users')} className="touch-input">
          Cancelar
        </Button>
      </div>
    </div>
  );
}
