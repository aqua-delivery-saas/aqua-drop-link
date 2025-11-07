import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, DollarSign, TrendingUp } from 'lucide-react';
import { mockMetrics, mockMonthlyUsers, mockDailyOrders } from '@/data/mockAdminData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AdvancedMetricsCards } from '@/components/admin/AdvancedMetricsCards';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminDashboard() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  return (
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
            <p className="text-heading-1 text-foreground">{mockMetrics.activeDistributors}</p>
            <p className="text-body-sm text-muted-foreground mt-1">
              de {mockMetrics.totalDistributors} totais
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Ganhos Mensais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-heading-1 text-foreground">
              R$ {mockMetrics.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-body-sm text-accent-green mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{mockMetrics.monthlyGrowth}% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <Users className="w-4 h-4" />
              Novos Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-heading-1 text-foreground">{mockMetrics.newUsersThisMonth}</p>
            <p className="text-body-sm text-muted-foreground mt-1">
              neste mês
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
                Novos Usuários por Mês
              </CardTitle>
              <p className="text-body-sm text-muted-foreground">Crescimento de usuários cadastrados</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockMonthlyUsers}>
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
                    name="Usuários"
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
                <BarChart data={mockDailyOrders}>
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
  );
}
