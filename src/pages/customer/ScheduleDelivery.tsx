import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { Minus, Plus, MapPin, CreditCard, Calendar, User, Phone, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { DeliveryScheduler } from "@/components/customer/DeliveryScheduler";
import { useDistributorBySlug } from "@/hooks/useCities";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useCreateOrder } from "@/hooks/useDistributor";
import { format } from "date-fns";

const ScheduleDelivery = () => {
  const navigate = useNavigate();
  const { distributorSlug } = useParams();
  const { user } = useAuth();
  
  const { data: distribuidora, isLoading: distributorLoading } = useDistributorBySlug(distributorSlug || "");

  // Fetch products for this distributor
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['distributor-products', distribuidora?.id],
    queryFn: async () => {
      if (!distribuidora?.id) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('distributor_id', distribuidora.id)
        .eq('is_available', true)
        .order('sort_order');
      if (error) throw error;
      return data || [];
    },
    enabled: !!distribuidora?.id,
  });

  // Fetch business hours
  const { data: businessHours } = useQuery({
    queryKey: ['business-hours', distribuidora?.id],
    queryFn: async () => {
      if (!distribuidora?.id) return [];
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .eq('distributor_id', distribuidora.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!distribuidora?.id,
  });

  // Fetch discount rules
  const { data: discountRules } = useQuery({
    queryKey: ['discount-rules', distribuidora?.id],
    queryFn: async () => {
      if (!distribuidora?.id) return [];
      const { data, error } = await supabase
        .from('discount_rules')
        .select('*')
        .eq('distributor_id', distribuidora.id)
        .eq('is_active', true)
        .order('min_quantity');
      if (error) throw error;
      return data || [];
    },
    enabled: !!distribuidora?.id,
  });

  const isLoading = distributorLoading || productsLoading;

  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customerName, setCustomerName] = useState(user?.user_metadata?.full_name || "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [containerYearStart, setContainerYearStart] = useState("");
  const [containerYearEnd, setContainerYearEnd] = useState("");
  
  const createOrder = useCreateOrder();

  // Calculate discount based on quantity
  const calculateDiscount = (qty: number): number => {
    if (!discountRules || discountRules.length === 0) return 0;
    
    const applicableRule = discountRules
      .filter(rule => qty >= rule.min_quantity && (!rule.max_quantity || qty <= rule.max_quantity))
      .sort((a, b) => b.discount_percent - a.discount_percent)[0];
    
    return applicableRule ? Number(applicableRule.discount_percent) : 0;
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !selectedDate || !selectedTime || !address || !paymentMethod || !customerName || !customerPhone) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const product = (products || []).find(p => p.id === selectedProduct);
    if (!product || !distribuidora) return;
    
    const subtotalValue = Number(product.price) * quantity;
    const discountPercentage = calculateDiscount(quantity);
    const discountAmountValue = subtotalValue * (discountPercentage / 100);
    const totalValue = subtotalValue - discountAmountValue;

    // Determine delivery period from time
    const hour = parseInt(selectedTime.split(':')[0]);
    let deliveryPeriod: 'manha' | 'tarde' | 'noite' = 'manha';
    if (hour >= 12 && hour < 18) deliveryPeriod = 'tarde';
    else if (hour >= 18) deliveryPeriod = 'noite';

    try {
      const createdOrder = await createOrder.mutateAsync({
        order: {
          distributor_id: distribuidora.id,
          customer_id: user?.id || null,
          customer_name: customerName,
          customer_phone: customerPhone,
          order_type: 'scheduled',
          scheduled_date: format(selectedDate, "yyyy-MM-dd"),
          delivery_period: deliveryPeriod,
          delivery_street: address,
          payment_method: paymentMethod as 'dinheiro' | 'pix' | 'cartao',
          subtotal: subtotalValue,
          discount_amount: discountAmountValue,
          total: totalValue,
          notes: notes || null,
          container_year_start: containerYearStart ? parseInt(containerYearStart) : null,
          container_year_end: containerYearEnd ? parseInt(containerYearEnd) : null,
        },
        items: [{
          product_id: product.id,
          product_name: product.name,
          product_liters: Number(product.liters),
          quantity,
          unit_price: Number(product.price),
          total_price: subtotalValue,
        }],
      });

      navigate("/schedule/confirmation", {
        state: {
          orderId: createdOrder.id,
          orderNumber: createdOrder.order_number,
          product: product.name,
          quantity,
          address,
          paymentMethod,
          subtotal: subtotalValue,
          discount: discountAmountValue,
          total: totalValue,
          distributor: distribuidora.name,
          scheduledDate: selectedDate.toLocaleDateString('pt-BR'),
          scheduledTime: selectedTime,
          whatsappUrl: distribuidora.whatsapp ? `https://wa.me/${distribuidora.whatsapp}?text=${encodeURIComponent(
            `Olá! Agendamento #${createdOrder.order_number}:\n\nProduto: ${product.name}\nQtd: ${quantity}\nData: ${selectedDate.toLocaleDateString('pt-BR')}\nHorário: ${selectedTime}\nTotal: R$ ${totalValue.toFixed(2)}\nEndereço: ${address}\nPagamento: ${paymentMethod}${notes ? `\nObs: ${notes}` : ''}`
          )}` : null,
        },
      });
    } catch (error) {
      // Error already handled by mutation
    }
  };

  const selectedProductData = (products || []).find(p => p.id === selectedProduct);
  const subtotal = selectedProductData ? Number(selectedProductData.price) * quantity : 0;
  const discountPercentage = calculateDiscount(quantity);
  const discountAmount = subtotal * (discountPercentage / 100);
  const total = subtotal - discountAmount;

  // Convert business hours to the format expected by DeliveryScheduler
  const formattedBusinessHours = (businessHours || []).map(bh => {
    const dayNames = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    return {
      dia_semana: dayNames[bh.day_of_week] || '',
      hora_abertura: bh.open_time || '08:00',
      hora_fechamento: bh.close_time || '18:00',
      ativo: bh.is_open,
    };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }
  
  if (!distribuidora) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
      </div>
    );
  }

  const pageTitle = `${distribuidora.name} - Agendar Entrega`;
  const pageDescription = `Agende sua entrega de água mineral com ${distribuidora.name}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <Logo size="md" />
                <p className="text-sm text-muted-foreground mt-1">{distribuidora.name}</p>
              </div>
              <Badge variant="default" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Agendamento
              </Badge>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Agendar Entrega</h1>
            <p className="text-muted-foreground">
              Escolha o melhor dia e horário para receber sua água
            </p>
          </div>

          <form onSubmit={handleSchedule} className="space-y-6">
            {/* Product Selection */}
            <Card>
              <CardHeader>
                <CardTitle>1. Escolha o Produto</CardTitle>
                <CardDescription>Selecione a marca e quantidade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base">Marca</Label>
                  {(products || []).length === 0 ? (
                    <p className="text-muted-foreground">Nenhum produto disponível</p>
                  ) : (
                    <RadioGroup value={selectedProduct} onValueChange={setSelectedProduct}>
                      {(products || []).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => setSelectedProduct(product.id)}
                        >
                          <RadioGroupItem value={product.id} id={`schedule-${product.id}`} />
                          {product.image_url && (
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          )}
                          <Label htmlFor={`schedule-${product.id}`} className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">{product.liters}L</div>
                              </div>
                              <span className="text-primary font-bold">R$ {Number(product.price).toFixed(2)}</span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Quantidade</Label>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Container Year */}
                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-base">Ano do Vasilhame</Label>
                  <p className="text-sm text-muted-foreground">
                    Informe o ano de fabricação do seu galão (geralmente gravado no fundo)
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="containerYearStart">Ano Inicial</Label>
                      <Input
                        id="containerYearStart"
                        type="number"
                        min="2010"
                        max={new Date().getFullYear()}
                        placeholder="Ex: 2018"
                        value={containerYearStart}
                        onChange={(e) => setContainerYearStart(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="containerYearEnd">Ano Final</Label>
                      <Input
                        id="containerYearEnd"
                        type="number"
                        min="2010"
                        max={new Date().getFullYear()}
                        placeholder="Ex: 2023"
                        value={containerYearEnd}
                        onChange={(e) => setContainerYearEnd(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date and Time Selection */}
            <div>
              <h3 className="text-xl font-semibold mb-3">2. Escolha Data e Horário</h3>
              <DeliveryScheduler
                businessHours={formattedBusinessHours}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                selectedTime={selectedTime}
                onTimeChange={setSelectedTime}
              />
            </div>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  3. Seus Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Seu Nome</Label>
                  <Input
                    id="customerName"
                    placeholder="Nome completo"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Telefone / WhatsApp</Label>
                  <Input
                    id="customerPhone"
                    placeholder="(11) 99999-9999"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  4. Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input
                    id="address"
                    placeholder="Rua, número, complemento, bairro"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Observações (opcional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Ex: Entregar no portão lateral, tocar interfone 102..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  5. Forma de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {distribuidora.accepts_cash && (
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="dinheiro" id="schedule-dinheiro" />
                      <Label htmlFor="schedule-dinheiro" className="cursor-pointer flex-1">Dinheiro</Label>
                    </div>
                  )}
                  {distribuidora.accepts_card && (
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="cartao" id="schedule-cartao" />
                      <Label htmlFor="schedule-cartao" className="cursor-pointer flex-1">Cartão na Entrega</Label>
                    </div>
                  )}
                  {distribuidora.accepts_pix && (
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="pix" id="schedule-pix" />
                      <Label htmlFor="schedule-pix" className="cursor-pointer flex-1">Pix</Label>
                    </div>
                  )}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Summary */}
            {selectedProductData && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Resumo do Agendamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Produto:</span>
                    <span className="font-medium">{selectedProductData.name} ({quantity}x)</span>
                  </div>
                  {selectedDate && selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Agendado para:</span>
                      <span className="font-medium">
                        {selectedDate.toLocaleDateString('pt-BR')} às {selectedTime}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto ({discountPercentage}%):</span>
                      <span>-R$ {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button 
              type="submit" 
              size="lg" 
              className="w-full" 
              disabled={createOrder.isPending || !selectedProduct || !selectedDate || !selectedTime || !address || !paymentMethod || !customerName || !customerPhone}
            >
              {createOrder.isPending ? "Processando..." : "Confirmar Agendamento"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                Voltar
              </Button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default ScheduleDelivery;
