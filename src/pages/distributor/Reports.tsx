import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Award, TrendingUp, DollarSign, ShoppingBag, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDistributorStats, useDistributorOrders, useDistributorProducts } from "@/hooks/useDistributor";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export default function Reports() {
  const stats = useDistributorStats();
  const { data: orders = [], isLoading } = useDistributorOrders();
  const { data: products = [] } = useDistributorProducts();

  const ordersPerDay = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const dayStats = days.map(day => ({ day, orders: 0, revenue: 0 }));
    
    orders.forEach(order => {
      const dayIndex = new Date(order.created_at).getDay();
      dayStats[dayIndex].orders += 1;
      dayStats[dayIndex].revenue += Number(order.total);
    });
    
    return dayStats;
  }, [orders]);

  const topProducts = useMemo(() => {
    const productStats: Record<string, { name: string; sales: number; revenue: number }> = {};
    
    orders.forEach(order => {
      const items = (order as any).order_items || [];
      items.forEach((item: any) => {
        if (!productStats[item.product_name]) {
          productStats[item.product_name] = { name: item.product_name, sales: 0, revenue: 0 };
        }
        productStats[item.product_name].sales += item.quantity;
        productStats[item.product_name].revenue += Number(item.total_price);
      });
    });
    
    const totalSales = Object.values(productStats).reduce((sum, p) => sum + p.sales, 0);
    
    return Object.values(productStats)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map(p => ({ ...p, percentage: totalSales > 0 ? Math.round((p.sales / totalSales) * 100) : 0 }));
  }, [orders]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Relatórios - AquaDelivery</title>
      </Helmet>
      <div className="space-y-6">
      <div>
        <h1 className="text-heading-1 text-foreground">Relatórios</h1>
        <p className="text-body-md text-muted-foreground mt-1">Análise detalhada do desempenho da sua distribuidora</p>
      </div>

      {/* Resumo de Vendas */}
      <div>
        <h2 className="text-heading-3 text-foreground mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />Resumo de Vendas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-body-sm text-muted-foreground mb-1">Total de Pedidos</p>
                <p className="text-heading-2 text-foreground">{stats.monthOrders}</p>
                <p className="text-body-xs text-muted-foreground mt-1">este mês</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-body-sm text-muted-foreground mb-1">Receita Total</p>
                <p className="text-heading-2 text-foreground">R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-body-sm text-muted-foreground mb-1">Ticket Médio</p>
                <p className="text-heading-2 text-foreground">R$ {stats.averageTicket.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-body-sm text-muted-foreground mb-1">Maior Venda</p>
                <p className="text-heading-2 text-foreground">R$ {stats.maxOrder.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gráfico de Pedidos por Dia */}
      <div>
        <h2 className="text-heading-3 text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />Pedidos por Dia da Semana
        </h2>
        <Card className="border-border">
          <CardHeader className="pb-2"><CardDescription>Volume de pedidos nos últimos dias</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersPerDay}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Pedidos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Produtos Mais Vendidos */}
      {topProducts.length > 0 && (
        <div>
          <h2 className="text-heading-3 text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />Produtos Mais Vendidos
          </h2>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${index === 0 ? 'bg-yellow-500 text-yellow-950' : index === 1 ? 'bg-gray-300 text-gray-700' : index === 2 ? 'bg-orange-400 text-orange-950' : 'bg-primary text-primary-foreground'}`}>
                      {index + 1}º
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md font-medium text-foreground">{product.name}</p>
                      <p className="text-body-sm text-muted-foreground">{product.sales} vendas ({product.percentage}% do total)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-body-md font-semibold text-foreground">R$ {product.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </>
  );
}
