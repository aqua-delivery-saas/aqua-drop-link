import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Repeat, Target } from 'lucide-react';
import { useAdminMetrics } from '@/hooks/useAdminData';
import { Skeleton } from '@/components/ui/skeleton';

export const AdvancedMetricsCards = () => {
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const isLoading = metricsLoading;

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

  const totalDistributors = metrics?.totalDistributors || 0;
  const activeSubscriptions = metrics?.activeSubscriptions || 0;
  const conversionRate = totalDistributors > 0 ? ((activeSubscriptions / totalDistributors) * 100).toFixed(1) : '0';

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
            {activeSubscriptions} de {totalDistributors} com pagamento em dia
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

      {/* Receita de Assinaturas */}
      <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Receita de Assinaturas
            </CardTitle>
            <TrendingUp className="text-accent-green w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-heading-1 text-foreground">
            R$ {(metrics?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-body-sm text-muted-foreground mt-1">
            receita de planos SaaS
          </p>
        </CardContent>
      </Card>

      {/* Distribuidoras cadastradas */}
      <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer animate-fade-in" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <Users className="w-4 h-4" />
              Distribuidoras
            </CardTitle>
            <TrendingUp className="text-accent-green w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-heading-1 text-foreground">{totalDistributors}</div>
          <p className="text-body-sm text-muted-foreground mt-1">
            cadastros no sistema
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
          <div className="text-heading-1 text-foreground">{activeSubscriptions}</div>
          <p className="text-body-sm text-muted-foreground mt-1">
            pagamento em dia
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
