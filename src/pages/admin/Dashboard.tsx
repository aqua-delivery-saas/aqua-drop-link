import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, DollarSign, TrendingUp } from 'lucide-react';
import { useAdminMetrics, useAllOrders } from '@/hooks/useAdminData';
import { AdvancedMetricsCards } from '@/components/admin/AdvancedMetricsCards';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays, startOfDay, eachDayOfInterval, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminDashboard() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const { data: orders, isLoading: ordersLoading } = useAllOrders();

  const isLoading = metricsLoading || ordersLoading;

  // Calculate orders by day of week
  const ordersByDay = useMemo(() => {
    if (!orders) return [];
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    
    orders.forEach(order => {
      const day = getDay(new Date(order.created_at));
      counts[day]++;
    });

    return dayNames.map((day, index) => ({
      day,
      orders: counts[index]
    }));
  }, [orders]);

  // Calculate monthly user growth (simulated from orders)
  const monthlyData = useMemo(() => {
    if (!orders) return [];
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const interval = eachDayOfInterval({
      start: subDays(new Date(), days),
      end: new Date()
    });

    const groupedByMonth: Record<string, number> = {};
    orders.forEach(order => {
      const month = format(new Date(order.created_at), 'MMM', { locale: ptBR });
      groupedByMonth[month] = (groupedByMonth[month] || 0) + 1;
    });

    return Object.entries(groupedByMonth).map(([month, count]) => ({
      month,
      users: count
    }));
  }, [orders, period]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-border">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin - Dashboard</title>
      </Helmet>
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-heading-1 text-foreground">Dashboard Administrativo</h1>
          <p className="text-body-lg text-muted-foreground mt-2">
            Visão geral do sistema Aqua Delivery
          </p>
        </div>
        <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <Card className="border-border hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Distribuidoras Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-heading-1 text-foreground">{metrics?.activeDistributors || 0}</p>
            <p className="text-body-sm text-muted-foreground mt-1">
              de {metrics?.totalDistributors || 0} totais
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-heading-1 text-foreground">
              R$ {(metrics?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-body-sm text-accent-green mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {metrics?.totalOrders || 0} pedidos
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <Users className="w-4 h-4" />
              Assinaturas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-heading-1 text-foreground">{metrics?.activeSubscriptions || 0}</p>
            <p className="text-body-sm text-muted-foreground mt-1">
              assinaturas em vigor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Avançadas */}
      <div>
        <h2 className="text-heading-2 text-foreground mb-4">Métricas Avançadas</h2>
        <AdvancedMetricsCards />
      </div>

      {/* Gráficos Interativos */}
      <div>
        <h2 className="text-heading-2 text-foreground mb-4">Análises Detalhadas</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border hover-lift animate-fade-in">
            <CardHeader>
              <CardTitle className="text-heading-3 text-foreground">
                Pedidos por Mês
              </CardTitle>
              <p className="text-body-sm text-muted-foreground">Volume de pedidos mensais</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="month" 
                    className="text-muted-foreground"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-muted-foreground"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Pedidos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border hover-lift animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="text-heading-3 text-foreground">
                Pedidos por Dia da Semana
              </CardTitle>
              <p className="text-body-sm text-muted-foreground">Volume de pedidos semanal</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ordersByDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    cursor={{ fill: 'hsl(var(--accent))' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="orders" 
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                    name="Pedidos"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}
