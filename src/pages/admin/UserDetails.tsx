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
import { useAdminUserById } from '@/hooks/useAdminData';
import { ArrowLeft, Mail, Phone, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading } = useAdminUserById(id || '');

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-10 w-24" />
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-body-lg text-muted-foreground">Usuário não encontrado</p>
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
      description: `Um link de recuperação foi enviado para o usuário`,
      duration: 4000,
    });
  };

  const handleToggleStatus = () => {
    toast.success('Status alterado!', {
      description: 'O status do usuário foi atualizado.',
      duration: 3000,
    });
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
          <h1 className="text-heading-1 text-foreground">{user.full_name || 'Usuário'}</h1>
          <p className="text-body-lg text-muted-foreground mt-2">{user.phone || 'Sem telefone'}</p>
        </div>
        <Badge className="bg-accent-green/10 text-accent-green">
          Ativo
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-heading-3 text-foreground">
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-body-sm text-muted-foreground">Nome Completo</Label>
              <Input defaultValue={user.full_name || ''} className="mt-1" />
            </div>

            <div>
              <Label className="text-body-sm text-muted-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefone
              </Label>
              <Input defaultValue={user.phone || ''} className="mt-1" />
            </div>

          </CardContent>
        </Card>

        {/* Configurações de Acesso */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-heading-3 text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Configurações de Acesso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-body-sm text-muted-foreground">Tipo de Usuário</Label>
              <Select defaultValue={user.role || 'customer'}>
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
              <Label className="text-body-sm text-muted-foreground">Data de Cadastro</Label>
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
                    Alterar Status
                  </Button>
                }
                title="Alterar status?"
                description="Deseja alterar o status deste usuário?"
                confirmLabel="Confirmar"
                variant="default"
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
