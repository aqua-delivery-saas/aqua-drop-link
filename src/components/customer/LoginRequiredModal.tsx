import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  distributorClosed?: boolean;
}

export const LoginRequiredModal = ({ open, onOpenChange, distributorClosed = false }: LoginRequiredModalProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Login Necessário</DialogTitle>
          <DialogDescription className="text-base">
            {distributorClosed
              ? "Para agendar um pedido quando a distribuidora está fechada, é necessário fazer login ou criar uma conta."
              : "Para agendar uma entrega, é necessário fazer login ou criar uma conta."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4 w-full">
          <Button onClick={() => navigate("/customer/login")} className="w-full" size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Entrar
          </Button>

          <Button onClick={() => navigate("/customer/signup")} variant="outline" className="w-full" size="lg">
            <UserPlus className="mr-2 h-4 w-4" />
            Criar conta
          </Button>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={distributorClosed} className="w-full whitespace-normal h-auto py-3 text-sm">
            {distributorClosed ? "Agendamento obrigatório (distribuidora fechada)" : "Continuar sem agendar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
