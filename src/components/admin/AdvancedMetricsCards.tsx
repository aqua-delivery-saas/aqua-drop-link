import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, DollarSign, UserMinus, Repeat, Target } from 'lucide-react';
import { useAdminMetrics, useAdminDistributors } from '@/hooks/useAdminData';
import { Skeleton } from '@/components/ui/skeleton';

export const AdvancedMetricsCards = () => {
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const { data: distributors, isLoading: distributorsLoading } = useAdminDistributors();

  const isLoading = metricsLoading || distributorsLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-border">
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeDistributors = distributors?.filter(d => d.is_active)?.length || 0;
  const totalDistributors = distributors?.length || 0;
  const conversionRate = totalDistributors > 0 ? ((activeDistributors / totalDistributors) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Taxa de Conversão */}
      <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <Target className="w-4 h-4" />
              Taxa de Ativação
            </CardTitle>
            <TrendingUp className="text-accent-green w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-heading-1 text-foreground">{conversionRate}%</div>
          <p className="text-body-sm text-muted-foreground mt-1">
            {activeDistributors} de {totalDistributors} distribuidoras ativas
          </p>
        </CardContent>
      </Card>

      {/* Total de Pedidos */}
      <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer animate-fade-in" style={{ animationDelay: '100ms' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total de Pedidos
            </CardTitle>
            <TrendingUp className="text-accent-green w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-heading-1 text-foreground">
            {metrics?.totalOrders || 0}
          </div>
          <p className="text-body-sm text-muted-foreground mt-1">
            pedidos realizados
          </p>
        </CardContent>
      </Card>

      {/* Receita Total */}
      <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Receita Total
            </CardTitle>
            <TrendingUp className="text-accent-green w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-heading-1 text-foreground">
            R$ {(metrics?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-body-sm text-muted-foreground mt-1">
            receita acumulada
          </p>
        </CardContent>
      </Card>

      {/* Distribuidoras Ativas */}
      <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer animate-fade-in" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <Users className="w-4 h-4" />
              Distribuidoras Ativas
            </CardTitle>
            <TrendingUp className="text-accent-green w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-heading-1 text-foreground">{activeDistributors}</div>
          <p className="text-body-sm text-muted-foreground mt-1">
            de {totalDistributors} cadastradas
          </p>
        </CardContent>
      </Card>

      {/* Assinaturas Ativas */}
      <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer animate-fade-in" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <Repeat className="w-4 h-4" />
              Assinaturas Ativas
            </CardTitle>
            <TrendingUp className="text-accent-green w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-heading-1 text-foreground">{metrics?.activeSubscriptions || 0}</div>
          <p className="text-body-sm text-muted-foreground mt-1">
            assinaturas em vigor
          </p>
        </CardContent>
      </Card>

      {/* Cidades Ativas */}
      <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer animate-fade-in" style={{ animationDelay: '500ms' }}>
        <CardHeader>
          <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
            <Target className="w-4 h-4" />
            Cidades Ativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-heading-1 text-foreground">{metrics?.activeCities || 0}</div>
          <p className="text-body-sm text-muted-foreground mt-1">
            cidades com distribuidoras
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
