import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Settings, Share2, ShoppingBag, TrendingUp, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { distributorStats, ordersPerDay } from '@/data/mockDistributorData';

export default function Dashboard() {
  const navigate = useNavigate();
  const distributorLink = "https://aquadelivery.com/distribuidor/agua-cristalina";
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(distributorLink);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-1 text-foreground">Dashboard</h1>
        <p className="text-body-md text-muted-foreground mt-1">
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

      {/* Gráfico de Pedidos */}
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

      {/* Cards de Ações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
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
