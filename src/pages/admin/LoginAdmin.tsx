import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/Logo';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginAdmin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Login realizado com sucesso!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Credenciais inválidas ou você não é um administrador.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Logo />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h1 className="text-heading-2 text-gray-900">Painel Administrativo</h1>
          </div>
          <p className="text-body-md text-gray-600 text-center">
            Acesso restrito para administradores
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-body-sm text-gray-600">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@aquadelivery.com"
              {...register('email')}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-body-sm text-accent-red mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-body-sm text-gray-600">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className="mt-1"
            />
            {errors.password && (
              <p className="text-body-sm text-accent-red mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar no Painel'}
          </Button>
        </form>

        <div className="pt-4 border-t border-gray-300">
          <p className="text-body-sm text-gray-600 text-center">
            Use: <strong>admin@aquadelivery.com</strong> com qualquer senha
          </p>
        </div>
      </div>
    </div>
  );
}
