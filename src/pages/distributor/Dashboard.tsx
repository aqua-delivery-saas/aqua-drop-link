import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Settings, Share2, ShoppingBag, TrendingUp, Clock, DollarSign, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { distributorStats, ordersPerDay, monthlyOrders, peakHours, topProducts } from '@/data/mockDistributorData';
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const navigate = useNavigate();
  const distributorLink = "https://aquadelivery.com/distribuidor/agua-cristalina";
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(distributorLink);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-foreground">Dashboard</h1>
        <p className="text-body-lg text-muted-foreground mt-2">
          Bem-vindo ao painel da sua distribuidora
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <Card className="border-border hover-lift cursor-pointer" onClick={() => navigate('/distributor/orders')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Pedidos Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-heading-1 text-foreground">{distributorStats.todayOrders}</div>
            <p className="text-body-sm text-muted-foreground mt-1">
              {distributorStats.weekOrders} esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Receita do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-heading-1 text-foreground">
              R$ {distributorStats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-body-sm text-accent-green mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Ticket Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-heading-1 text-foreground">
              R$ {distributorStats.averageTicket.toFixed(2)}
            </div>
            <p className="text-body-sm text-muted-foreground mt-1">
              {distributorStats.monthOrders} pedidos
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover-lift cursor-pointer" onClick={() => navigate('/distributor/products')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-body-md text-muted-foreground font-normal flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produtos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-heading-1 text-foreground">8</div>
            <p className="text-body-sm text-muted-foreground mt-1">
              2 marcas cadastradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="text-heading-3 text-foreground">Pedidos por Dia da Semana</CardTitle>
            <CardDescription>Volume de pedidos nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersPerDay}>
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

        <Card className="border-border animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="text-heading-3 text-foreground">Evolução Mensal</CardTitle>
            <CardDescription>Pedidos e receita nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
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
                  yAxisId="left"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  name="Pedidos"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--accent-green))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--accent-green))', r: 4 }}
                  name="Receita (R$)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Horários de Pico e Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border animate-fade-in" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="text-heading-3 text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horários de Pico
            </CardTitle>
            <CardDescription>Volume de pedidos por período do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {peakHours.map((slot) => (
                <div 
                  key={slot.hour}
                  className={`p-4 rounded-lg text-center transition-all hover:scale-105 ${
                    slot.intensity === 'high' 
                      ? 'bg-accent-red/10 border-2 border-accent-red/20' 
                      : slot.intensity === 'medium' 
                      ? 'bg-accent-orange/10 border-2 border-accent-orange/20' 
                      : 'bg-accent-green/10 border-2 border-accent-green/20'
                  }`}
                >
                  <div className="text-body-sm font-semibold text-foreground">{slot.hour}</div>
                  <div className="text-heading-3 text-foreground mt-1">{slot.orders}</div>
                  <Badge 
                    variant="outline" 
                    className={`mt-2 text-xs ${
                      slot.intensity === 'high' 
                        ? 'border-accent-red text-accent-red' 
                        : slot.intensity === 'medium' 
                        ? 'border-accent-orange text-accent-orange' 
                        : 'border-accent-green text-accent-green'
                    }`}
                  >
                    {slot.intensity === 'high' ? 'Alto' : slot.intensity === 'medium' ? 'Médio' : 'Baixo'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border animate-fade-in" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="text-heading-3 text-foreground flex items-center gap-2">
              <Award className="w-5 h-5" />
              Produtos Mais Vendidos
            </CardTitle>
            <CardDescription>Top 5 produtos do mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4 hover-lift p-2 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-body-xs text-muted-foreground">
                      {product.sales} vendas • {product.percentage}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-body-sm font-semibold text-foreground">
                      R$ {product.revenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Médio Detalhado */}
      <Card className="border-border animate-fade-in" style={{ animationDelay: '500ms' }}>
        <CardHeader>
          <CardTitle className="text-heading-3 text-foreground">Análise de Ticket Médio</CardTitle>
          <CardDescription>Estatísticas detalhadas dos pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-accent/5 border border-border">
              <p className="text-body-sm text-muted-foreground mb-2">Ticket Médio</p>
              <p className="text-heading-1 text-foreground">
                R$ {distributorStats.averageTicket.toFixed(2)}
              </p>
              <p className="text-body-xs text-muted-foreground mt-2">
                Baseado em {distributorStats.monthOrders} pedidos
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-accent/5 border border-border">
              <p className="text-body-sm text-muted-foreground mb-2">Menor Pedido</p>
              <p className="text-heading-1 text-foreground">
                R$ {distributorStats.minOrder.toFixed(2)}
              </p>
              <p className="text-body-xs text-muted-foreground mt-2">Pedido mínimo do mês</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-accent/5 border border-border">
              <p className="text-body-sm text-muted-foreground mb-2">Maior Pedido</p>
              <p className="text-heading-1 text-foreground">
                R$ {distributorStats.maxOrder.toFixed(2)}
              </p>
              <p className="text-body-xs text-muted-foreground mt-2">Pedido máximo do mês</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Ações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
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
            <div className="flex gap-2">
              <Input value={distributorLink} readOnly className="font-mono text-xs" />
              <Button onClick={handleCopyLink} size="sm">
                Copiar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
