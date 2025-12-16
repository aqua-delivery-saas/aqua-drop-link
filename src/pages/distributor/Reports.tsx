import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Award, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";
import { distributorStats, peakHours, topProducts } from '@/data/mockDistributorData';
import { Badge } from "@/components/ui/badge";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-1 text-foreground">Relatórios</h1>
        <p className="text-body-md text-muted-foreground mt-1">
          Análise detalhada do desempenho da sua distribuidora
        </p>
      </div>

      {/* Resumo de Vendas */}
      <div>
        <h2 className="text-heading-3 text-foreground mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Resumo de Vendas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-body-sm text-muted-foreground mb-1">Total de Pedidos</p>
                <p className="text-heading-2 text-foreground">{distributorStats.monthOrders}</p>
                <p className="text-body-xs text-muted-foreground mt-1">este mês</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-body-sm text-muted-foreground mb-1">Receita Total</p>
                <p className="text-heading-2 text-foreground">
                  R$ {distributorStats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-body-xs text-accent-green mt-1 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.5% vs mês anterior
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-body-sm text-muted-foreground mb-1">Ticket Médio</p>
                <p className="text-heading-2 text-foreground">
                  R$ {distributorStats.averageTicket.toFixed(2)}
                </p>
                <p className="text-body-xs text-muted-foreground mt-1">por pedido</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-body-sm text-muted-foreground mb-1">Maior Venda</p>
                <p className="text-heading-2 text-foreground">
                  R$ {distributorStats.maxOrder.toFixed(2)}
                </p>
                <p className="text-body-xs text-muted-foreground mt-1">este mês</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Horários de Pico */}
      <div>
        <h2 className="text-heading-3 text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Horários de Pico
        </h2>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription>
              Saiba quais horários têm mais pedidos para organizar suas entregas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {peakHours.map((slot) => (
                <div 
                  key={slot.hour}
                  className={`p-4 rounded-lg text-center ${
                    slot.intensity === 'high' 
                      ? 'bg-accent-red/10 border border-accent-red/30' 
                      : slot.intensity === 'medium' 
                      ? 'bg-accent-orange/10 border border-accent-orange/30' 
                      : 'bg-accent-green/10 border border-accent-green/30'
                  }`}
                >
                  <div className="text-body-md font-medium text-foreground">{slot.hour}</div>
                  <div className="text-heading-3 text-foreground mt-1">{slot.orders}</div>
                  <div className="text-body-xs text-muted-foreground">pedidos</div>
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
                    {slot.intensity === 'high' ? 'Pico' : slot.intensity === 'medium' ? 'Moderado' : 'Tranquilo'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Produtos Mais Vendidos */}
      <div>
        <h2 className="text-heading-3 text-foreground mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Produtos Mais Vendidos
        </h2>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription>
              Os produtos que seus clientes mais compram
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div 
                  key={product.name} 
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    index === 0 ? 'bg-yellow-500 text-yellow-950' : 
                    index === 1 ? 'bg-gray-300 text-gray-700' : 
                    index === 2 ? 'bg-orange-400 text-orange-950' : 
                    'bg-primary text-primary-foreground'
                  }`}>
                    {index + 1}º
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md font-medium text-foreground">{product.name}</p>
                    <p className="text-body-sm text-muted-foreground">
                      {product.sales} vendas ({product.percentage}% do total)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-body-md font-semibold text-foreground">
                      R$ {product.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-body-xs text-muted-foreground">receita</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dica */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <ShoppingBag className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-body-md font-medium text-foreground">Dica para aumentar suas vendas</p>
              <p className="text-body-sm text-muted-foreground mt-1">
                Seus horários de pico são pela manhã. Considere oferecer promoções nos horários mais tranquilos 
                para distribuir melhor a demanda ao longo do dia.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
