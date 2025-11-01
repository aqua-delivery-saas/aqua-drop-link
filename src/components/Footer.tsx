import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Distribuidora de Água</h3>
            <p className="text-sm text-muted-foreground">
              Conectando distribuidoras com clientes de forma simples e eficiente.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  Suporte
                </Link>
              </li>
            </ul>
          </div>

          {/* For Distributors */}
          <div className="space-y-3">
            <h4 className="font-semibold">Para Distribuidoras</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/distributor/signup" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cadastrar Distribuidora
                </Link>
              </li>
              <li>
                <Link to="/distributor/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/distributor/subscription" className="text-muted-foreground hover:text-foreground transition-colors">
                  Planos e Preços
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Distribuidora de Água. Todos os direitos reservados.</p>
          <p>Feito com ❤️ no Brasil</p>
        </div>
      </div>
    </footer>
  );
}
