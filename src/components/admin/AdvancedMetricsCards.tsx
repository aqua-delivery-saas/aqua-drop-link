import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, DollarSign, UserMinus, Repeat, Target } from 'lucide-react';
import { advancedMetrics } from '@/data/mockAdminData';

export const AdvancedMetricsCards = () => {
  const { conversion_rate, average_ticket, churn_rate, lifetime_value, renewal_rate } = advancedMetrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Taxa de Conversão */}
      <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <Target className="w-4 h-4" />
              Taxa de Conversão
            </CardTitle>
            {conversion_rate.trend === 'up' ? (
              <TrendingUp className="text-accent-green w-5 h-5" />
            ) : (
              <TrendingDown className="text-accent-red w-5 h-5" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-heading-1 text-foreground">{conversion_rate.rate}%</div>
          <p className="text-body-sm text-muted-foreground mt-1">
            {conversion_rate.signups} de {conversion_rate.visitors.toLocaleString('pt-BR')} visitantes
          </p>
          <Badge variant="outline" className="mt-2 text-accent-green border-accent-green/20">
            {conversion_rate.variation} vs mês anterior
          </Badge>
        </CardContent>
      </Card>

      {/* Ticket Médio */}
      <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer animate-fade-in" style={{ animationDelay: '100ms' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Ticket Médio
            </CardTitle>
            {average_ticket.trend === 'up' ? (
              <TrendingUp className="text-accent-green w-5 h-5" />
            ) : (
              <TrendingDown className="text-accent-red w-5 h-5" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-heading-1 text-foreground">
            R$ {average_ticket.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-body-sm text-muted-foreground mt-1">
            vs R$ {average_ticket.previous.toFixed(2)} anterior
          </p>
          <Badge variant="outline" className="mt-2 text-accent-green border-accent-green/20">
            {average_ticket.variation}
          </Badge>
        </CardContent>
      </Card>

      {/* Churn Rate */}
      <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <UserMinus className="w-4 h-4" />
              Churn Rate
            </CardTitle>
            {churn_rate.trend === 'down' ? (
              <TrendingDown className="text-accent-green w-5 h-5" />
            ) : (
              <TrendingUp className="text-accent-red w-5 h-5" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-heading-1 text-foreground">{churn_rate.monthly}%</div>
          <p className="text-body-sm text-muted-foreground mt-1">
            {churn_rate.cancellations_this_month} cancelamentos este mês
          </p>
          <Badge variant="outline" className="mt-2 text-accent-green border-accent-green/20">
            {churn_rate.variation} vs mês anterior
          </Badge>
        </CardContent>
      </Card>

      {/* LTV (Lifetime Value) */}
      <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer animate-fade-in" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <Users className="w-4 h-4" />
              LTV Médio
            </CardTitle>
            {lifetime_value.trend === 'up' ? (
              <TrendingUp className="text-accent-green w-5 h-5" />
            ) : (
              <TrendingDown className="text-accent-red w-5 h-5" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-heading-1 text-foreground">
            R$ {lifetime_value.average_ltv.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-3 pt-3 border-t border-border space-y-1">
            <div className="flex justify-between text-body-sm">
              <span className="text-muted-foreground">Mensal:</span>
              <span className="font-medium text-foreground">R$ {lifetime_value.by_plan.monthly.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-muted-foreground">Anual:</span>
              <span className="font-medium text-foreground">R$ {lifetime_value.by_plan.annual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Taxa de Renovação */}
      <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer animate-fade-in" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <Repeat className="w-4 h-4" />
              Taxa de Renovação
            </CardTitle>
            {renewal_rate.trend === 'up' ? (
              <TrendingUp className="text-accent-green w-5 h-5" />
            ) : (
              <TrendingDown className="text-accent-red w-5 h-5" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-heading-1 text-foreground">{renewal_rate.rate}%</div>
          <p className="text-body-sm text-muted-foreground mt-1">
            {renewal_rate.renewed} de {renewal_rate.total_expiring} assinaturas
          </p>
          <Badge variant="outline" className="mt-2 text-accent-green border-accent-green/20">
            {renewal_rate.variation} vs mês anterior
          </Badge>
        </CardContent>
      </Card>

      {/* Top Distribuidoras por Ticket */}
      <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer animate-fade-in md:col-span-2 lg:col-span-1" style={{ animationDelay: '500ms' }}>
        <CardHeader>
          <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Top Distribuidoras (Ticket)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {average_ticket.per_distributor.map((dist, index) => (
              <div key={dist.name} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-medium text-foreground truncate">{dist.name}</p>
                </div>
                <div className="text-body-sm font-semibold text-foreground">
                  R$ {dist.ticket.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
