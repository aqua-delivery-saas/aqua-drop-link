import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Settings, Share2, ShoppingBag, TrendingUp, DollarSign, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDistributorStats, useDistributor } from "@/hooks/useDistributor";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type OrderStatus = 'novo' | 'em_entrega' | 'concluido' | 'cancelado';
const statusLabels: Record<OrderStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
}> = {
  novo: { label: 'Novo', variant: 'default' },
  em_entrega: { label: 'Em Entrega', variant: 'secondary' },
  concluido: { label: 'Entregue', variant: 'outline' },
  cancelado: { label: 'Cancelado', variant: 'destructive' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: distributor, isLoading: isLoadingDistributor } = useDistributor();
  const stats = useDistributorStats();

  const distributorLink = distributor?.slug 
    ? `${window.location.origin}/order/${distributor.slug}` 
    : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(distributorLink);
    toast.success("Link copiado para a área de transferência!");
  };

  if (isLoadingDistributor) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border-border">
              <CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-16" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - AquaDelivery</title>
      </Helmet>
      <div className="space-y-6">
      <div>
        <h1 className="text-heading-1 text-foreground">Dashboard</h1>
        <p className="text-body-md text-muted-foreground mt-1">
          Bem-vindo ao painel da sua distribuidora
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
        <Card className="border-border hover-lift cursor-pointer" onClick={() => navigate('/distributor/orders')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Pedidos Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-heading-1 text-foreground">{stats.todayOrders}</div>
            <p className="text-body-sm text-muted-foreground mt-1">
              {stats.weekOrders} esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Receita Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-heading-1 text-foreground">
              R$ {stats.todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-body-sm text-muted-foreground mt-1">
              Média: R$ {stats.averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover-lift sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Receita do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-heading-1 text-foreground">
              R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-body-sm text-muted-foreground mt-1">
              {stats.monthOrders} pedidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Últimos Pedidos */}
      <Card className="border-border animate-fade-in" style={{ animationDelay: '100ms' }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-heading-3 text-foreground">Últimos Pedidos</CardTitle>
          <Button variant="link" className="p-0 h-auto text-primary" onClick={() => navigate('/distributor/orders')}>
            Ver todos →
          </Button>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="text-body-md text-muted-foreground text-center py-8">
              Nenhum pedido recebido ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map(order => (
                <div 
                  key={order.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer gap-3" 
                  onClick={() => navigate('/distributor/orders')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-body-md font-medium text-foreground truncate">{order.customer_name}</p>
                      <p className="text-body-sm text-muted-foreground truncate">Pedido #{order.order_number}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-shrink-0 pl-13 sm:pl-0">
                    <div className="text-left sm:text-right">
                      <p className="text-body-md font-semibold text-foreground">
                        R$ {Number(order.total).toFixed(2)}
                      </p>
                      <p className="text-body-xs text-muted-foreground flex items-center gap-1 sm:justify-end">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                    <Badge variant={statusLabels[order.status as OrderStatus]?.variant || 'default'} className="min-w-[100px] justify-center">
                      {statusLabels[order.status as OrderStatus]?.label || order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cards de Ações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
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
            {distributorLink ? (
              <div className="flex gap-2">
                <Input value={distributorLink} readOnly className="font-mono text-xs" />
                <Button onClick={handleCopyLink} size="sm">
                  Copiar
                </Button>
              </div>
            ) : (
              <p className="text-body-sm text-muted-foreground">
                Complete seu cadastro para ter um link público.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
