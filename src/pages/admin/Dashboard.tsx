import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, AlertCircle, ShoppingCart } from 'lucide-react';
import { mockMetrics, mockMonthlyUsers, mockDailyOrders } from '@/data/mockAdminData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-1 text-gray-900">Dashboard Administrativo</h1>
        <p className="text-body-lg text-gray-600 mt-2">
          Visão geral do sistema Aqua Delivery
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-gray-600 font-normal flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-heading-1 text-gray-900">{mockMetrics.totalUsers}</p>
            <p className="text-body-sm text-accent-green mt-1">
              +{mockMetrics.newUsersThisMonth} este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-gray-600 font-normal flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Distribuidoras Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-heading-1 text-gray-900">{mockMetrics.activeDistributors}</p>
            <p className="text-body-sm text-gray-600 mt-1">
              de {mockMetrics.totalDistributors} totais
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-gray-600 font-normal flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Assinaturas Vencidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-heading-1 text-accent-red">{mockMetrics.expiredSubscriptions}</p>
            <p className="text-body-sm text-gray-600 mt-1">
              Requer atenção
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-gray-600 font-normal flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Total de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-heading-1 text-gray-900">{mockMetrics.totalOrders}</p>
            <p className="text-body-sm text-gray-600 mt-1">
              Desde o início
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-300">
          <CardHeader>
            <CardTitle className="text-heading-3 text-gray-900">
              Novos Usuários por Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockMonthlyUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#007BFF" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-gray-300">
          <CardHeader>
            <CardTitle className="text-heading-3 text-gray-900">
              Pedidos por Dia da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockDailyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="orders" fill="#007BFF" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
