import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center space-y-6">
        <ShieldAlert className="w-16 h-16 text-accent-red mx-auto" />
        <h1 className="text-heading-1 text-gray-900">Acesso Negado</h1>
        <p className="text-body-lg text-gray-600">
          Você não tem permissão para acessar esta página.
        </p>
        <Button onClick={() => navigate(-1)} className="w-full">
          Voltar
        </Button>
      </div>
    </div>
  );
}
