import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { Package, Settings, ShoppingBag, Link2, Copy } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const distributorLink = `${window.location.origin}/order/distribuidora-agua-pura`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(distributorLink);
    toast.success("Link copiado para a área de transferência!");
  };

  const stats = {
    todayOrders: 8,
    weekOrders: 42,
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel da Distribuidora</h1>
          <p className="text-muted-foreground">Gerencie seus pedidos e configurações</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/distributor/orders")}>
            <CardHeader>
              <ShoppingBag className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Pedidos Recebidos</CardTitle>
              <CardDescription>Visualize e gerencie pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.todayOrders}</div>
              <p className="text-sm text-muted-foreground">pedidos hoje</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/distributor/products")}>
            <CardHeader>
              <Package className="h-8 w-8 text-secondary mb-2" />
              <CardTitle>Produtos / Marcas</CardTitle>
              <CardDescription>Gerencie suas marcas e preços</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">5</div>
              <p className="text-sm text-muted-foreground">marcas cadastradas</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/distributor/settings")}>
            <CardHeader>
              <Settings className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Configurações</CardTitle>
              <CardDescription>Ajuste suas preferências</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Formas de pagamento, dados, WhatsApp</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link2 className="h-6 w-6 text-primary" />
              <CardTitle>Link Público do seu Pedido</CardTitle>
            </div>
            <CardDescription>Compartilhe este link com seus clientes para que eles façam pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                value={distributorLink} 
                readOnly 
                className="flex-1 bg-card"
              />
              <Button onClick={handleCopyLink} size="lg">
                <Copy className="mr-2 h-4 w-4" />
                Copiar link
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de pedidos:</span>
                  <span className="font-semibold">{stats.weekOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Média por dia:</span>
                  <span className="font-semibold">{Math.round(stats.weekOrders / 7)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/distributor/products")}>
                <Package className="mr-2 h-4 w-4" />
                Adicionar nova marca
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/distributor/orders")}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Ver pedidos pendentes
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Missing Input import
import { Input } from "@/components/ui/input";

export default Dashboard;
