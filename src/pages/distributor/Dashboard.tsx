import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Settings, Share2, ShoppingBag, TrendingUp, DollarSign, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { distributorStats, recentOrders } from '@/data/mockDistributorData';
type OrderStatus = 'waiting' | 'pending_delivery' | 'delivered' | 'cancelled';
const statusLabels: Record<OrderStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive' | 'success';
}> = {
  waiting: {
    label: 'Aguardando entrega',
    variant: 'default'
  },
  pending_delivery: {
    label: 'Entrega Pendente',
    variant: 'destructive'
  },
  delivered: {
    label: 'Entregue',
    variant: 'success'
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'outline'
  }
};
const getOrderStatus = (order: {
  status: string;
  minutesAgo: number;
}): OrderStatus => {
  if (order.status === 'delivered') return 'delivered';
  if (order.status === 'cancelled') return 'cancelled';
  if (order.minutesAgo > 40) return 'pending_delivery';
  return 'waiting';
};
export default function Dashboard() {
  const navigate = useNavigate();
  const distributorLink = "https://aquadelivery.com/distribuidor/agua-cristalina";
  const handleCopyLink = () => {
    navigator.clipboard.writeText(distributorLink);
    toast.success("Link copiado para a área de transferência!");
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-heading-1 text-foreground">Dashboard</h1>
        <p className="text-body-md text-muted-foreground mt-1">
          Bem-vindo ao painel da sua distribuidora
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <Card className="border-border hover-lift cursor-pointer" onClick={() => navigate('/distributor/orders')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Pedidos Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-heading-1 text-foreground">{distributorStats.todayOrders}</div>
            <p className="text-body-sm text-muted-foreground mt-1">
              {distributorStats.weekOrders} esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Receita do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-heading-1 text-foreground">
              R$ {distributorStats.totalRevenue.toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
            </div>
            <p className="text-body-sm text-accent-green mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% vs mês anterior
            </p>
          </CardContent>
        </Card>

        

        
      </div>

      {/* Últimos Pedidos */}
      <Card className="border-border animate-fade-in" style={{
      animationDelay: '100ms'
    }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading-3 text-foreground">Últimos Pedidos</CardTitle>
          <Button variant="link" className="p-0 h-auto text-primary" onClick={() => navigate('/distributor/orders')}>
            Ver todos →
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map(order => <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate('/distributor/orders')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-body-md font-medium text-foreground">{order.customer}</p>
                    <p className="text-body-sm text-muted-foreground">{order.items}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right min-w-[100px]">
                    <p className="text-body-md font-semibold text-foreground">
                      R$ {order.total.toFixed(2)}
                    </p>
                    <p className="text-body-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      {order.time}
                    </p>
                  </div>
                  <Badge variant={statusLabels[getOrderStatus(order)].variant} className="min-w-[140px] justify-center flex-shrink-0">
                    {statusLabels[getOrderStatus(order)].label}
                  </Badge>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>
      {/* Cards de Ações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{
      animationDelay: '200ms'
    }}>
        <Card className="border-border hover-lift cursor-pointer" onClick={() => navigate('/distributor/products')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5 text-primary" />
              Produtos / Marcas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-md text-muted-foreground">
              Gerencie seus produtos e marcas de água
            </p>
            <Button variant="link" className="mt-4 p-0 h-auto text-primary">
              Gerenciar produtos →
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border hover-lift cursor-pointer" onClick={() => navigate('/distributor/settings')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Settings className="h-5 w-5 text-primary" />
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-md text-muted-foreground">
              Configure horários, entregas e mais
            </p>
            <Button variant="link" className="mt-4 p-0 h-auto text-primary">
              Ir para configurações →
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Share2 className="h-5 w-5 text-primary" />
              Link Público
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-md text-muted-foreground mb-4">
              Compartilhe com seus clientes
            </p>
            <div className="flex gap-2">
              <Input value={distributorLink} readOnly className="font-mono text-xs" />
              <Button onClick={handleCopyLink} size="sm">
                Copiar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}