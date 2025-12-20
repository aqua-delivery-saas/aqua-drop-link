import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Minus, Plus, Clock, Gift, CalendarDays, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getDistribuidoraBySlug } from "@/data/mockData";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { LoginRequiredModal } from "@/components/customer/LoginRequiredModal";
import { format, addDays, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
interface Product {
  id: string;
  name: string;
  litros: number;
  price: number;
  foto?: string;
}
type DeliveryPeriod = "manha" | "tarde" | "noite";
const periodLabels: Record<DeliveryPeriod, string> = {
  manha: "Manhã (08:00 - 12:00)",
  tarde: "Tarde (12:00 - 18:00)",
  noite: "Noite (18:00 - 21:00)"
};
const OrderPage = () => {
  const navigate = useNavigate();
  const {
    distributorSlug
  } = useParams();
  const {
    user,
    isAuthenticated
  } = useAuth();
  const distribuidora = getDistribuidoraBySlug(distributorSlug || "");
  if (!distribuidora) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Distribuidora não encontrada</CardTitle>
            <CardDescription>A distribuidora que você procura não existe.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>;
  }
  const products = distribuidora.products.map(p => ({
    id: p.id.toString(),
    name: p.name,
    litros: p.litros,
    price: p.price,
    foto: p.foto
  }));

  // Mock de cliente logado (simulando 8 pedidos já feitos)
  const mockCustomer = {
    isLoggedIn: isAuthenticated && user?.role === 'customer',
    name: user?.full_name || "Cliente",
    orderCount: 8
  };
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [anoVasilhameInicial, setAnoVasilhameInicial] = useState("");
  const [anoVasilhameFinal, setAnoVasilhameFinal] = useState("");
  const [detalhesPedido, setDetalhesPedido] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // Scheduling states
  const [wantsToSchedule, setWantsToSchedule] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledPeriod, setScheduledPeriod] = useState<DeliveryPeriod | "">("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [nextOpenTime, setNextOpenTime] = useState<string>("");

  // Calculate next open time
  const getNextOpenTime = useMemo(() => {
    const now = new Date();
    const weekDays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    for (let i = 0; i <= 7; i++) {
      const checkDate = addDays(now, i);
      const dayName = weekDays[checkDate.getDay()];
      const schedule = distribuidora.businessHours.find(s => s.dia_semana.toLowerCase() === dayName.toLowerCase() && s.ativo);
      if (schedule) {
        const [openHour, openMinute] = schedule.hora_abertura.split(':').map(Number);
        const openTime = setMinutes(setHours(checkDate, openHour), openMinute);
        if (i === 0) {
          // Today - check if still has time to open
          const currentTime = now.toTimeString().slice(0, 5);
          if (currentTime < schedule.hora_abertura) {
            return `hoje às ${schedule.hora_abertura}`;
          }
          if (currentTime >= schedule.hora_abertura && currentTime <= schedule.hora_fechamento) {
            return null; // Already open
          }
        } else if (i === 1) {
          return `amanhã às ${schedule.hora_abertura}`;
        } else {
          return `${format(checkDate, "EEEE", {
            locale: ptBR
          })} às ${schedule.hora_abertura}`;
        }
      }
    }
    return "em breve";
  }, [distribuidora.businessHours]);

  // Verificar se está aberta
  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('pt-BR', {
        weekday: 'long'
      });
      const currentTime = now.toTimeString().slice(0, 5);
      const todaySchedule = distribuidora.businessHours.find(s => s.dia_semana.toLowerCase() === currentDay.toLowerCase());
      if (!todaySchedule || !todaySchedule.ativo) {
        setIsOpen(false);
        return;
      }
      const open = currentTime >= todaySchedule.hora_abertura && currentTime <= todaySchedule.hora_fechamento;
      setIsOpen(open);

      // If closed, scheduling becomes mandatory
      if (!open) {
        setWantsToSchedule(true);
      }
    };
    checkIfOpen();
    const interval = setInterval(checkIfOpen, 60000);
    return () => clearInterval(interval);
  }, [distribuidora]);

  // Calcular desconto baseado na quantidade
  const calculateDiscount = (qty: number): number => {
    const {
      tier1,
      tier2
    } = distribuidora.discounts;
    if (qty >= tier2.min) {
      return tier2.percentage;
    } else if (qty >= tier1.min && qty <= tier1.max) {
      return tier1.percentage;
    }
    return 0;
  };

  // Calcular progresso da fidelização
  const loyaltyProgress = mockCustomer.isLoggedIn ? mockCustomer.orderCount % distribuidora.loyalty.ordersRequired : 0;
  const loyaltyRemaining = distribuidora.loyalty.ordersRequired - loyaltyProgress;
  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  // Check if scheduling is required (when closed)
  const isSchedulingRequired = !isOpen;

  // Check if can submit
  const canSubmit = useMemo(() => {
    const baseFieldsValid = selectedProduct && address && paymentMethod;
    if (isSchedulingRequired || wantsToSchedule) {
      return baseFieldsValid && scheduledDate && scheduledPeriod && mockCustomer.isLoggedIn;
    }
    return baseFieldsValid;
  }, [selectedProduct, address, paymentMethod, isSchedulingRequired, wantsToSchedule, scheduledDate, scheduledPeriod, mockCustomer.isLoggedIn]);

  // Handle scheduling toggle
  const handleScheduleToggle = (checked: boolean) => {
    if (checked && !mockCustomer.isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setWantsToSchedule(checked);
  };

  // Handle scheduling field click when not logged in
  const handleScheduleFieldClick = () => {
    if (!mockCustomer.isLoggedIn) {
      setShowLoginModal(true);
    }
  };

  // Disable past dates and closed days
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    const weekDays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const dayName = weekDays[date.getDay()];
    const schedule = distribuidora.businessHours.find(s => s.dia_semana.toLowerCase() === dayName.toLowerCase());
    return !schedule || !schedule.ativo;
  };
  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !address || !paymentMethod) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    if ((isSchedulingRequired || wantsToSchedule) && (!scheduledDate || !scheduledPeriod)) {
      toast.error("Para agendar, selecione a data e o período de entrega");
      return;
    }
    if ((isSchedulingRequired || wantsToSchedule) && !mockCustomer.isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const product = products.find(p => p.id === selectedProduct);
      const subtotal = (product?.price || 0) * quantity;
      const discountPercentage = calculateDiscount(quantity);
      const discountAmount = subtotal * (discountPercentage / 100);
      const total = subtotal - discountAmount;
      navigate("/order/confirmation", {
        state: {
          product: product?.name,
          quantity,
          address,
          paymentMethod,
          subtotal,
          discount: discountAmount,
          total,
          distributor: distribuidora.nome,
          isScheduled: wantsToSchedule || isSchedulingRequired,
          scheduledDate: scheduledDate ? format(scheduledDate, "dd/MM/yyyy") : null,
          scheduledPeriod: scheduledPeriod ? periodLabels[scheduledPeriod] : null,
          whatsappUrl: `https://wa.me/${distribuidora.whatsapp}?text=${encodeURIComponent(`Olá! Pedido:\n\nProduto: ${product?.name}\nQtd: ${quantity}\nTotal: R$ ${total.toFixed(2)}\nEndereço: ${address}\nPagamento: ${paymentMethod}${(wantsToSchedule || isSchedulingRequired) && scheduledDate ? `\n📅 Agendado para: ${format(scheduledDate, "dd/MM/yyyy")} - ${periodLabels[scheduledPeriod as DeliveryPeriod]}` : ""}`)}`
        }
      });
      setLoading(false);
    }, 1000);
  };
  const selectedProductData = products.find(p => p.id === selectedProduct);
  const subtotal = selectedProductData ? selectedProductData.price * quantity : 0;
  const discountPercentage = calculateDiscount(quantity);
  const discountAmount = subtotal * (discountPercentage / 100);
  const total = subtotal - discountAmount;
  const pageTitle = `${distribuidora.nome} - Pedido de Água`;
  const pageDescription = distribuidora.descricao_curta;
  return <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={distribuidora.palavras_chave} />
      </Helmet>
      
      <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} distributorClosed={!isOpen} />
      
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <Logo size="md" />
                <p className="text-sm text-muted-foreground mt-1">{distribuidora.nome}</p>
              </div>
              <Badge variant={isOpen ? "default" : "destructive"} className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {isOpen ? "Aberta" : "Fechada"}
              </Badge>
            </div>
          </div>
        </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-4">
        {/* Closed warning with next open time */}
        {!isOpen && <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-destructive">
                    A distribuidora está fechada no momento
                  </p>
                  <p className="text-sm text-destructive/80">
                    Para continuar, é necessário agendar seu pedido.
                  </p>
                  {getNextOpenTime && <p className="text-sm text-muted-foreground mt-2">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Próximo horário de atendimento: <span className="font-medium">{getNextOpenTime}</span>
                    </p>}
                </div>
              </div>
            </CardContent>
          </Card>}

        {/* Loyalty card - only when open or when logged in */}
        {distribuidora.loyalty.enabled && mockCustomer.isLoggedIn && isOpen && <Card className="border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Gift className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-primary">Programa de Fidelização Ativo</p>
                  <p className="text-sm text-muted-foreground">
                    Faltam apenas {loyaltyRemaining} pedidos para ganhar: {distribuidora.loyalty.reward}
                  </p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{
                    width: `${loyaltyProgress / distribuidora.loyalty.ordersRequired * 100}%`
                  }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>}

        {/* ========== DISTRIBUTOR OPEN: Show full order form ========== */}
        {isOpen && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl">Fazer Pedido</CardTitle>
              <CardDescription>Escolha sua água e finalize em menos de 1 minuto</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOrder} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base">Escolha a Marca</Label>
                  <RadioGroup value={selectedProduct} onValueChange={setSelectedProduct}>
                    {products.map(product => <div key={product.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setSelectedProduct(product.id)}>
                        <RadioGroupItem value={product.id} id={product.id} />
                        {product.foto && <img src={product.foto} alt={product.name} className="w-16 h-16 object-cover rounded-md" />}
                        <Label htmlFor={product.id} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">{product.litros}L</div>
                            </div>
                            <span className="text-primary font-bold">R$ {product.price.toFixed(2)}</span>
                          </div>
                        </Label>
                      </div>)}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Quantidade</Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-4 w-full">
                      <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(-1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                      <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {selectedProductData && <div className="w-full">
                        {discountPercentage > 0 ? <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Subtotal: <span className="line-through">R$ {subtotal.toFixed(2)}</span>
                            </p>
                            <p className="text-sm text-green-600 font-medium">
                              Desconto ({discountPercentage}%): -R$ {discountAmount.toFixed(2)}
                            </p>
                            <p className="text-primary font-bold text-xl">
                              Total: R$ {total.toFixed(2)}
                            </p>
                          </div> : <span className="text-muted-foreground">
                            Total: <span className="text-primary font-bold text-xl">
                              R$ {total.toFixed(2)}
                            </span>
                          </span>}
                      </div>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-base">Endereço de Entrega</Label>
                  <Input id="address" placeholder="Rua, número, complemento" value={address} onChange={e => setAddress(e.target.value)} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="anoVasilhameInicial" className="text-base">Ano Vasilhame Inicial</Label>
                    <Input id="anoVasilhameInicial" type="number" placeholder="Ex: 2020" value={anoVasilhameInicial} onChange={e => setAnoVasilhameInicial(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anoVasilhameFinal" className="text-base">Ano Vasilhame Final</Label>
                    <Input id="anoVasilhameFinal" type="number" placeholder="Ex: 2024" value={anoVasilhameFinal} onChange={e => setAnoVasilhameFinal(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detalhesPedido" className="text-base">Detalhes do Pedido</Label>
                  <textarea id="detalhesPedido" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" placeholder="Observações adicionais sobre o pedido..." value={detalhesPedido} onChange={e => setDetalhesPedido(e.target.value)} />
                </div>

                <div className="space-y-3">
                  <Label className="text-base">Forma de Pagamento</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="dinheiro" id="dinheiro" />
                      <Label htmlFor="dinheiro" className="cursor-pointer flex-1">Dinheiro</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="cartao" id="cartao" />
                      <Label htmlFor="cartao" className="cursor-pointer flex-1">Cartão na Entrega</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="cursor-pointer flex-1">Pix (Manual)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading || !canSubmit}>
                  {loading ? "Processando..." : wantsToSchedule ? "Agendar Pedido" : "Fazer Pedido"}
                </Button>

                {!isAuthenticated && <div className="text-center">
                    <Button type="button" variant="link" onClick={() => navigate("/customer/signup")}>
                      Crie uma conta para agendar entregas e ganhar benefícios
                    </Button>
                  </div>}
              </form>
            </CardContent>
          </Card>
        )}

        {/* ========== DISTRIBUTOR CLOSED: Show only scheduling card ========== */}
        {!isOpen && (
          <Card className="shadow-xl border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <CalendarDays className="h-6 w-6 text-primary" />
                    Agendar Entrega
                  </CardTitle>
                  <CardDescription>
                    A distribuidora está fechada. Agende seu pedido para o próximo dia disponível.
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Obrigatório
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Not logged in - show login CTA */}
              {!mockCustomer.isLoggedIn ? (
                <div className="space-y-6">
                  <div className="text-center p-6 bg-muted/50 rounded-lg border-2 border-dashed">
                    <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Faça login para agendar</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Para agendar um pedido fora do horário de funcionamento, é necessário fazer login ou criar uma conta.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={() => navigate("/customer/login")} size="lg">
                        Entrar
                      </Button>
                      <Button variant="outline" onClick={() => navigate("/customer/signup")} size="lg">
                        Criar conta
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Logged in - show scheduling form */
                <form onSubmit={handleOrder} className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base">Escolha a Marca</Label>
                    <RadioGroup value={selectedProduct} onValueChange={setSelectedProduct}>
                      {products.map(product => <div key={product.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setSelectedProduct(product.id)}>
                          <RadioGroupItem value={product.id} id={`schedule-${product.id}`} />
                          {product.foto && <img src={product.foto} alt={product.name} className="w-16 h-16 object-cover rounded-md" />}
                          <Label htmlFor={`schedule-${product.id}`} className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">{product.litros}L</div>
                              </div>
                              <span className="text-primary font-bold">R$ {product.price.toFixed(2)}</span>
                            </div>
                          </Label>
                        </div>)}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base">Quantidade</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-4 w-full">
                        <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(-1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                        <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {selectedProductData && <div className="w-full text-center">
                          {discountPercentage > 0 ? <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                Subtotal: <span className="line-through">R$ {subtotal.toFixed(2)}</span>
                              </p>
                              <p className="text-sm text-green-600 font-medium">
                                Desconto ({discountPercentage}%): -R$ {discountAmount.toFixed(2)}
                              </p>
                              <p className="text-primary font-bold text-xl">
                                Total: R$ {total.toFixed(2)}
                              </p>
                            </div> : <span className="text-muted-foreground">
                              Total: <span className="text-primary font-bold text-xl">
                                R$ {total.toFixed(2)}
                              </span>
                            </span>}
                        </div>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schedule-address" className="text-base">Endereço de Entrega</Label>
                    <Input id="schedule-address" placeholder="Rua, número, complemento" value={address} onChange={e => setAddress(e.target.value)} required />
                  </div>

                  {/* Scheduling fields */}
                  <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <CalendarDays className="h-5 w-5" />
                      Data e Período da Entrega
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-base">Data da Entrega</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !scheduledDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {scheduledDate ? format(scheduledDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-popover" align="start">
                          <Calendar
                            mode="single"
                            selected={scheduledDate}
                            onSelect={setScheduledDate}
                            disabled={isDateDisabled}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Período da Entrega</Label>
                      <Select value={scheduledPeriod} onValueChange={(value) => setScheduledPeriod(value as DeliveryPeriod)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o período" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="manha">{periodLabels.manha}</SelectItem>
                          <SelectItem value="tarde">{periodLabels.tarde}</SelectItem>
                          <SelectItem value="noite">{periodLabels.noite}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Forma de Pagamento</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="dinheiro" id="schedule-dinheiro" />
                        <Label htmlFor="schedule-dinheiro" className="cursor-pointer flex-1">Dinheiro</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="cartao" id="schedule-cartao" />
                        <Label htmlFor="schedule-cartao" className="cursor-pointer flex-1">Cartão na Entrega</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="pix" id="schedule-pix" />
                        <Label htmlFor="schedule-pix" className="cursor-pointer flex-1">Pix (Manual)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={loading || !canSubmit}>
                    {loading ? "Processando..." : "Agendar Pedido"}
                  </Button>

                  {/* Order summary when scheduling */}
                  {scheduledDate && scheduledPeriod && (
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Resumo do agendamento:</p>
                      <p className="font-medium flex items-center justify-center gap-2 mt-1">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        {format(scheduledDate, "dd/MM/yyyy")} - {periodLabels[scheduledPeriod]}
                      </p>
                    </div>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {products.length === 0 && <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">Nenhuma marca disponível no momento.</p>
            </CardContent>
          </Card>}
      </main>
    </div>
    </>;
};
export default OrderPage;