import { useState, useMemo } from 'react';
import { Helmet } from "react-helmet-async";
import { Building2, CreditCard, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAdminMetrics, useAdminFinancialData, useAllOrders } from '@/hooks/useAdminData';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function FinancialReports() {
  const [period, setPeriod] = useState('30');
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const { data: financialData, isLoading: financialLoading } = useAdminFinancialData();
  const { data: orders, isLoading: ordersLoading } = useAllOrders();

  const isLoading = metricsLoading || financialLoading || ordersLoading;

  // Calculate subscription distribution
  const planDistribution = useMemo(() => {
    if (!financialData?.subscriptions) return [];
    const monthly = financialData.subscriptions.filter(s => s.plan === 'monthly').length;
    const annual = financialData.subscriptions.filter(s => s.plan === 'annual').length;
    return [
      { name: 'Mensal', value: monthly, color: '#007BFF' },
      { name: 'Anual', value: annual, color: '#00C48C' },
    ];
  }, [financialData]);

  // Calculate monthly revenue from orders
  const monthlyRevenue = useMemo(() => {
    if (!orders) return [];
    const grouped: Record<string, { monthly: number; annual: number; total: number }> = {};
    
    orders.forEach(order => {
      const month = format(new Date(order.created_at), 'MMM/yy', { locale: ptBR });
      if (!grouped[month]) {
        grouped[month] = { monthly: 0, annual: 0, total: 0 };
      }
      grouped[month].total += order.total;
      grouped[month].monthly += 1;
    });

    return Object.entries(grouped).map(([month, data]) => ({
      month,
      monthly: data.monthly,
      annual: 0,
      total: data.total
    })).slice(-6);
  }, [orders]);

  // Subscription growth data
  const subscriptionGrowth = useMemo(() => {
    if (!financialData?.subscriptions) return [];
    const grouped: Record<string, { Mensal: number; Anual: number }> = {};
    
    financialData.subscriptions.forEach(sub => {
      const month = format(new Date(sub.created_at), 'MMM', { locale: ptBR });
      if (!grouped[month]) {
        grouped[month] = { Mensal: 0, Anual: 0 };
      }
      if (sub.plan === 'monthly') grouped[month].Mensal++;
      else grouped[month].Anual++;
    });

    return Object.entries(grouped).map(([mes, data]) => ({
      mes,
      ...data
    }));
  }, [financialData]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Distribuidoras Cadastradas',
      value: metrics?.totalDistributors || 0,
      subtitle: 'Total no sistema',
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Assinaturas Ativas',
      value: metrics?.activeSubscriptions || 0,
      subtitle: 'Pagamento em dia',
      icon: CreditCard,
      color: 'text-accent-green',
      bgColor: 'bg-accent-green/10',
    },
    {
      title: 'Assinaturas Inativas',
      value: (metrics?.totalDistributors || 0) - (metrics?.activeSubscriptions || 0),
      subtitle: 'Aguardando renovação',
      icon: AlertCircle,
      color: 'text-accent-red',
      bgColor: 'bg-accent-red/10',
    },
    {
      title: 'Receita Total',
      value: `R$ ${(metrics?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      subtitle: 'Receita acumulada',
      icon: DollarSign,
      color: 'text-accent-green',
      bgColor: 'bg-accent-green/10',
    },
  ];

  const handleExport = () => {
    console.log('Exportando relatório...');
  };

  return (
    <>
      <Helmet>
        <title>Admin - Relatórios Financeiros</title>
      </Helmet>
      <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-heading-1 text-foreground">Relatórios Financeiros</h1>
          <p className="text-body-md text-muted-foreground mt-1">
            Acompanhe o desempenho e os ganhos do Aqua Delivery
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="365">Ano atual</SelectItem>
            </SelectContent>
          </Select>
          <Button>Atualizar</Button>
        </div>
      </div>

      {/* Comparativo Mês a Mês */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-body-sm text-muted-foreground mb-2">Receita Total</p>
                <p className="text-heading-1 text-foreground mb-1">
                  R$ {(metrics?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-1 text-accent-green text-body-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>{metrics?.totalOrders || 0} pedidos</span>
                </div>
              </div>
              <div className="bg-accent-green/10 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-accent-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-body-sm text-muted-foreground mb-2">Distribuidoras Ativas</p>
                <p className="text-heading-1 text-foreground mb-1">{metrics?.activeDistributors || 0}</p>
                <div className="flex items-center gap-1 text-muted-foreground text-body-sm">
                  <span>de {metrics?.totalDistributors || 0} totais</span>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-body-sm text-muted-foreground mb-2">Cidades Atendidas</p>
                <p className="text-heading-1 text-foreground mb-1">{metrics?.activeCities || 0}</p>
                <div className="flex items-center gap-1 text-muted-foreground text-body-sm">
                  <span>cidades ativas</span>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-body-sm text-muted-foreground mb-2">{metric.title}</p>
                    <p className={`text-heading-1 ${metric.color} mb-1`}>{metric.value}</p>
                    <p className="text-body-sm text-muted-foreground">{metric.subtitle}</p>
                  </div>
                  <div className={`${metric.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Growth Chart */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Evolução de Assinaturas</CardTitle>
          <CardDescription>Novas assinaturas por mês</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={subscriptionGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Mensal" stroke="#007BFF" strokeWidth={2} />
              <Line type="monotone" dataKey="Anual" stroke="#00C48C" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Plan Distribution */}
      {planDistribution.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Distribuição de Planos Ativos</CardTitle>
            <CardDescription>Proporção entre planos mensais e anuais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {planDistribution.map((plan) => {
                  const total = planDistribution.reduce((sum, p) => sum + p.value, 0);
                  const percentage = total > 0 ? ((plan.value / total) * 100).toFixed(1) : '0';
                  return (
                    <div key={plan.name} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: plan.color }}
                      />
                      <span className="text-body-md text-foreground">
                        {plan.name}: <span className="font-semibold">{percentage}%</span> ({plan.value})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revenue Table */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Receita por Período</CardTitle>
            <CardDescription>Receitas agrupadas por mês</CardDescription>
          </div>
          <Button variant="outline" onClick={handleExport}>
            Exportar Relatório
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead className="text-right">Pedidos</TableHead>
                  <TableHead className="text-right">Receita Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyRevenue.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">{row.month}</TableCell>
                    <TableCell className="text-right">{row.monthly}</TableCell>
                    <TableCell className="text-right text-primary font-semibold">
                      R$ {row.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card className="border-l-4 border-l-primary bg-primary/5 border-border">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-heading-3 text-foreground mb-2">Resumo Financeiro Geral</h3>
              <p className="text-body-md text-foreground mb-1">
                Receita acumulada:{' '}
                <span className="font-semibold text-primary">
                  R$ {(metrics?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </p>
              <p className="text-body-sm text-muted-foreground">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
