import { useState } from 'react';
import { Building2, CreditCard, AlertCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  mockFinancialMetrics,
  mockSubscriptionGrowth,
  mockPlanDistribution,
  mockMonthlyRevenue,
  mockMetrics,
} from '@/data/mockAdminData';

export default function FinancialReports() {
  const [period, setPeriod] = useState('30');

  const metrics = [
    {
      title: 'Distribuidoras Cadastradas',
      value: mockFinancialMetrics.totalDistributors,
      subtitle: 'Total no sistema',
      icon: Building2,
      color: 'text-primary-500',
      bgColor: 'bg-primary-100',
    },
    {
      title: 'Assinaturas Ativas',
      value: mockFinancialMetrics.activeSubscriptions,
      subtitle: 'Pagamento em dia',
      icon: CreditCard,
      color: 'text-accent-green',
      bgColor: 'bg-accent-green/10',
    },
    {
      title: 'Assinaturas Inativas',
      value: mockFinancialMetrics.inactiveSubscriptions,
      subtitle: 'Aguardando renovação',
      icon: AlertCircle,
      color: 'text-accent-red',
      bgColor: 'bg-accent-red/10',
    },
    {
      title: 'Ganhos Totais',
      value: `R$ ${mockFinancialMetrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      subtitle: 'Receita acumulada',
      icon: DollarSign,
      color: 'text-accent-green',
      bgColor: 'bg-accent-green/10',
    },
  ];

  const handleExport = () => {
    console.log('Exportando relatório...');
    // Implementar exportação CSV
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-heading-1 text-gray-900">Relatórios Financeiros</h1>
          <p className="text-body-md text-gray-600 mt-1">
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
        {/* Receita Mensal */}
        <Card className="border-gray-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-body-sm text-gray-600 mb-2">Receita Mensal</p>
                <p className="text-heading-1 text-gray-900 mb-1">
                  R$ {mockFinancialMetrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-1 text-accent-green text-body-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{mockMetrics.monthlyGrowth}% vs mês anterior</span>
                </div>
              </div>
              <div className="bg-accent-green/10 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-accent-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Novos Usuários */}
        <Card className="border-gray-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-body-sm text-gray-600 mb-2">Novos Usuários</p>
                <p className="text-heading-1 text-gray-900 mb-1">{mockMetrics.newUsersThisMonth}</p>
                <div className="flex items-center gap-1 text-muted-foreground text-body-sm">
                  <span>{mockMetrics.previousMonthUsers} no mês anterior</span>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Novas Distribuidoras */}
        <Card className="border-gray-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-body-sm text-gray-600 mb-2">Novas Distribuidoras</p>
                <p className="text-heading-1 text-gray-900 mb-1">{mockMetrics.activeDistributors}</p>
                <div className="flex items-center gap-1 text-muted-foreground text-body-sm">
                  <span>{mockMetrics.previousMonthDistributors} no mês anterior</span>
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
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="border-gray-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-body-sm text-gray-600 mb-2">{metric.title}</p>
                    <p className={`text-heading-1 ${metric.color} mb-1`}>{metric.value}</p>
                    <p className="text-body-sm text-gray-500">{metric.subtitle}</p>
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
      <Card className="border-gray-300">
        <CardHeader>
          <CardTitle>Evolução de Assinaturas</CardTitle>
          <CardDescription>Novas assinaturas por mês</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockSubscriptionGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="mes" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
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
      <Card className="border-gray-300">
        <CardHeader>
          <CardTitle>Distribuição de Planos Ativos</CardTitle>
          <CardDescription>Proporção entre planos mensais e anuais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockPlanDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockPlanDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {mockPlanDistribution.map((plan) => {
                const total = mockPlanDistribution.reduce((sum, p) => sum + p.value, 0);
                const percentage = ((plan.value / total) * 100).toFixed(1);
                return (
                  <div key={plan.name} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: plan.color }}
                    />
                    <span className="text-body-md text-gray-700">
                      {plan.name}: <span className="font-semibold">{percentage}%</span> ({plan.value})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Table */}
      <Card className="border-gray-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Ganhos por Período</CardTitle>
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
                  <TableHead className="text-right">Assinaturas Mensais</TableHead>
                  <TableHead className="text-right">Assinaturas Anuais</TableHead>
                  <TableHead className="text-right">Ganho Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMonthlyRevenue.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">{row.month}</TableCell>
                    <TableCell className="text-right">{row.monthly}</TableCell>
                    <TableCell className="text-right">{row.annual}</TableCell>
                    <TableCell className="text-right text-primary-500 font-semibold">
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
      <Card className="border-l-4 border-l-primary-500 bg-primary-50 border-gray-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-heading-3 text-gray-900 mb-2">Resumo Financeiro Geral</h3>
              <p className="text-body-md text-gray-700 mb-1">
                Receita acumulada:{' '}
                <span className="font-semibold text-primary-500">
                  R$ {mockFinancialMetrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </p>
              <p className="text-body-sm text-gray-600">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
              <div className="mt-3 inline-block bg-accent-green/20 text-accent-green px-3 py-1 rounded-full text-body-sm font-medium">
                📈 Crescimento de +{mockFinancialMetrics.monthlyGrowth}% nas assinaturas neste mês
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
