// OrderPage - handles immediate orders when distributor is open
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { Minus, Plus, Clock, CalendarDays, AlertTriangle, MapPin, CreditCard, User, Phone, RefreshCw, MessageSquare, Star, Gift } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { formatPhone } from "@/lib/validators";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { LoginRequiredModal } from "@/components/customer/LoginRequiredModal";
import { UserMenu } from "@/components/customer/UserMenu";
import { useDistributorBySlug } from "@/hooks/useCities";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useCreateOrder } from "@/hooks/useDistributor";
import { useCustomerLoyaltyPoints, useRedeemLoyaltyPoints } from "@/hooks/useCustomerLoyalty";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RepeatOrderState {
  repeatItems?: {
    product_id: string | null;
    product_name: string;
    quantity: number;
  }[];
  repeatAddress?: string;
  repeatPaymentMethod?: string;
}
const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    distributorSlug
  } = useParams();
  const {
    user,
    isAuthenticated,
    isCustomer
  } = useAuth();
  const {
    data: distribuidora,
    isLoading: distributorLoading
  } = useDistributorBySlug(distributorSlug || "");

  // Check for repeat order data from navigation state
  const repeatState = location.state as RepeatOrderState | null;

  // Fetch products for this distributor
  const {
    data: products,
    isLoading: productsLoading
  } = useQuery({
    queryKey: ['distributor-products', distribuidora?.id],
    queryFn: async () => {
      if (!distribuidora?.id) return [];
      const {
        data,
        error
      } = await supabase.from('products').select('*').eq('distributor_id', distribuidora.id).eq('is_available', true).order('sort_order');
      if (error) throw error;
      return data || [];
    },
    enabled: !!distribuidora?.id
  });

  // Fetch business hours
  const {
    data: businessHours
  } = useQuery({
    queryKey: ['business-hours', distribuidora?.id],
    queryFn: async () => {
      if (!distribuidora?.id) return [];
      const {
        data,
        error
      } = await supabase.from('business_hours').select('*').eq('distributor_id', distribuidora.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!distribuidora?.id
  });

  // Fetch discount rules
  const {
    data: discountRules
  } = useQuery({
    queryKey: ['discount-rules', distribuidora?.id],
    queryFn: async () => {
      if (!distribuidora?.id) return [];
      const {
        data,
        error
      } = await supabase.from('discount_rules').select('*').eq('distributor_id', distribuidora.id).eq('is_active', true).order('min_quantity');
      if (error) throw error;
      return data || [];
    },
    enabled: !!distribuidora?.id
  });
  // Fetch customer loyalty points
  const { data: loyaltyData } = useCustomerLoyaltyPoints(distribuidora?.id);
  const redeemLoyalty = useRedeemLoyaltyPoints();

  const isLoading = distributorLoading || productsLoading;
  const mockCustomer = {
    isLoggedIn: isAuthenticated && isCustomer(),
    name: user?.user_metadata?.full_name || "Cliente",
    orderCount: 0
  };
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customerName, setCustomerName] = useState(user?.user_metadata?.full_name || "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRepeatOrder, setIsRepeatOrder] = useState(false);
  const [notes, setNotes] = useState("");
  const [containerYearStart, setContainerYearStart] = useState("");
  const [containerYearEnd, setContainerYearEnd] = useState("");
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const createOrder = useCreateOrder();

  // Check if user can redeem points
  const canRedeem = useMemo(() => {
    if (!loyaltyData?.program || !loyaltyData?.points) return false;
    return (loyaltyData.points.available_points || 0) >= loyaltyData.program.reward_threshold;
  }, [loyaltyData]);

  const handleRedeem = async () => {
    if (!distribuidora?.id || !loyaltyData?.program) return;
    
    await redeemLoyalty.mutateAsync({
      distributorId: distribuidora.id,
      pointsToRedeem: loyaltyData.program.reward_threshold,
      rewardDescription: loyaltyData.program.reward_description || 'Recompensa',
    });
    
    setShowRedeemDialog(false);
  };

  // Fetch customer profile for auto-fill
  useEffect(() => {
    async function fetchCustomerProfile() {
      if (!user?.id) return;
      const {
        data
      } = await supabase.from('profiles').select('full_name, phone, street, number, neighborhood, city, state').eq('id', user.id).maybeSingle();
      if (data) {
        if (data.full_name) setCustomerName(data.full_name);
        if (data.phone) setCustomerPhone(formatPhone(data.phone));

        // Build address string from profile fields
        if (data.street && !address) {
          const addressParts = [data.street, data.number, data.neighborhood, data.city, data.state].filter(Boolean);
          if (addressParts.length > 0) {
            setAddress(addressParts.join(', '));
          }
        }
      }
    }
    fetchCustomerProfile();
  }, [user?.id]);

  // Pre-fill form with repeat order data
  useEffect(() => {
    if (repeatState && products && products.length > 0) {
      // Find matching product from repeat items
      if (repeatState.repeatItems && repeatState.repeatItems.length > 0) {
        const firstItem = repeatState.repeatItems[0];
        const matchingProduct = products.find(p => p.id === firstItem.product_id || p.name === firstItem.product_name);
        if (matchingProduct) {
          setSelectedProduct(matchingProduct.id);
          setQuantity(firstItem.quantity);
        }
      }
      if (repeatState.repeatAddress) {
        setAddress(repeatState.repeatAddress);
      }
      if (repeatState.repeatPaymentMethod) {
        setPaymentMethod(repeatState.repeatPaymentMethod);
      }
      setIsRepeatOrder(true);
      toast.info("Pedido repetido - revise os dados antes de confirmar");
    }
  }, [repeatState, products]);

  // Default business hours fallback (08:00-18:00 Mon-Fri, 08:00-12:00 Sat, Sunday closed)
  const DEFAULT_BUSINESS_HOURS = [{
    day_of_week: 0,
    is_open: false,
    open_time: null,
    close_time: null
  },
  // Domingo
  {
    day_of_week: 1,
    is_open: true,
    open_time: '08:00',
    close_time: '18:00'
  },
  // Segunda
  {
    day_of_week: 2,
    is_open: true,
    open_time: '08:00',
    close_time: '18:00'
  },
  // Terça
  {
    day_of_week: 3,
    is_open: true,
    open_time: '08:00',
    close_time: '18:00'
  },
  // Quarta
  {
    day_of_week: 4,
    is_open: true,
    open_time: '08:00',
    close_time: '18:00'
  },
  // Quinta
  {
    day_of_week: 5,
    is_open: true,
    open_time: '08:00',
    close_time: '18:00'
  },
  // Sexta
  {
    day_of_week: 6,
    is_open: true,
    open_time: '08:00',
    close_time: '12:00'
  } // Sábado
  ];

  // Check if distributor is open
  useEffect(() => {
    // Use default business hours if none are configured
    const hoursToCheck = !businessHours || businessHours.length === 0 ? DEFAULT_BUSINESS_HOURS : businessHours;
    const checkIfOpen = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const currentTime = now.toTimeString().slice(0, 5);
      const todaySchedule = hoursToCheck.find(h => h.day_of_week === dayOfWeek);
      if (!todaySchedule || !todaySchedule.is_open) {
        setIsOpen(false);
        return;
      }

      // Normalize time format to HH:MM for comparison
      const openTime = todaySchedule.open_time?.slice(0, 5);
      const closeTime = todaySchedule.close_time?.slice(0, 5);
      const open = openTime && closeTime && currentTime >= openTime && currentTime <= closeTime;
      setIsOpen(!!open);
    };
    checkIfOpen();
    const interval = setInterval(checkIfOpen, 60000);
    return () => clearInterval(interval);
  }, [businessHours]);

  // Calculate discount based on quantity
  const calculateDiscount = (qty: number): number => {
    if (!discountRules || discountRules.length === 0) return 0;
    const applicableRule = discountRules.filter(rule => qty >= rule.min_quantity && (!rule.max_quantity || qty <= rule.max_quantity)).sort((a, b) => b.discount_percent - a.discount_percent)[0];
    return applicableRule ? Number(applicableRule.discount_percent) : 0;
  };
  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };
  const canSubmit = useMemo(() => {
    return selectedProduct && address && paymentMethod && customerName && customerPhone;
  }, [selectedProduct, address, paymentMethod, customerName, customerPhone]);
  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !address || !paymentMethod || !customerName || !customerPhone) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    const product = (products || []).find(p => p.id === selectedProduct);
    if (!product || !distribuidora) return;
    const subtotalValue = Number(product.price) * quantity;
    const discountPercentage = calculateDiscount(quantity);
    const discountAmountValue = subtotalValue * (discountPercentage / 100);
    const totalValue = subtotalValue - discountAmountValue;
    try {
      const createdOrder = await createOrder.mutateAsync({
        order: {
          distributor_id: distribuidora.id,
          customer_name: customerName,
          customer_phone: customerPhone,
          order_type: 'immediate',
          scheduled_date: null,
          delivery_period: null,
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
          total_price: subtotalValue
        }]
      });
      navigate("/order/confirmation", {
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
          isScheduled: false,
          scheduledDate: null,
          scheduledPeriod: null,
          whatsappUrl: distribuidora.whatsapp ? `https://wa.me/${distribuidora.whatsapp}?text=${encodeURIComponent(`Olá! Pedido #${createdOrder.order_number}:\n\nProduto: ${product.name}\nQtd: ${quantity}\nTotal: R$ ${totalValue.toFixed(2)}\nEndereço: ${address}\nPagamento: ${paymentMethod}${notes ? `\nObs: ${notes}` : ''}`)}` : null
        }
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
  if (isLoading) {
    return <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Skeleton className="h-96 w-full" />
        </main>
      </div>;
  }
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
  const pageTitle = `${distribuidora.name} - Pedido de Água`;
  const pageDescription = distribuidora.meta_description || 'Faça seu pedido de água mineral';
  return <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      <LoginRequiredModal open={showLoginModal} onOpenChange={setShowLoginModal} distributorClosed={!isOpen} />

      <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <Logo size="md" />
                <p className="text-sm text-muted-foreground mt-1">{distribuidora.name}</p>
              </div>
              <div className="flex items-center gap-2">
                
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl space-y-4">
          {/* Loyalty Points Card */}
          {loyaltyData?.program && mockCustomer.isLoggedIn && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span className="font-medium text-amber-800">{loyaltyData.program.program_name || 'Programa de Fidelidade'}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-amber-700">
                    Você tem <strong>{loyaltyData.points?.available_points || 0}</strong> de{' '}
                    <strong>{loyaltyData.program.reward_threshold}</strong> pontos para resgatar:{' '}
                    <span className="font-medium">{loyaltyData.program.reward_description || 'Recompensa'}</span>
                  </p>
                  <Progress 
                    value={Math.min(((loyaltyData.points?.available_points || 0) / loyaltyData.program.reward_threshold) * 100, 100)} 
                    className="h-2 bg-amber-200"
                  />
                  <p className="text-xs text-amber-600">
                    +{loyaltyData.program.points_per_order} ponto(s) por pedido
                    {loyaltyData.program.min_order_value && loyaltyData.program.min_order_value > 0 
                      ? ` acima de R$ ${Number(loyaltyData.program.min_order_value).toFixed(2)}`
                      : ''}
                  </p>
                  
                  {/* Redeem button - shows when threshold is reached */}
                  {canRedeem && (
                    <Button
                      className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white"
                      onClick={() => setShowRedeemDialog(true)}
                      disabled={redeemLoyalty.isPending}
                    >
                      <Gift className="mr-2 h-4 w-4" />
                      Resgatar: {loyaltyData.program.reward_description || 'Recompensa'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Repeat order notice */}
          {isRepeatOrder && <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 text-primary">
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-sm font-medium">Pedido repetido - revise os dados antes de confirmar</span>
                </div>
              </CardContent>
            </Card>}

          {/* When closed: show only schedule CTA */}
          {!isOpen ? <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Distribuidora Fechada</CardTitle>
                <CardDescription className="text-base">
                  {distribuidora.name} não está atendendo no momento, mas você pode agendar seu pedido para quando estivermos abertos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button size="lg" className="w-full" onClick={() => {
              if (!mockCustomer.isLoggedIn) {
                setShowLoginModal(true);
              } else {
                navigate(`/schedule/${distributorSlug}`);
              }
            }}>
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Agendar Entrega
                </Button>
                <div className="text-center">
                  <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                    Voltar
                  </Button>
                </div>
              </CardContent>
            </Card> : (/* When open: show full order form */
        <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl">Fazer Pedido</CardTitle>
                <CardDescription>Escolha sua água e finalize em menos de 1 minuto</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOrder} className="space-y-6">
                  {/* Product Selection */}
                  <div className="space-y-3">
                    <Label className="text-base">Escolha o Produto</Label>
                    {(products || []).length === 0 ? <p className="text-muted-foreground">Nenhum produto disponível</p> : <RadioGroup value={selectedProduct} onValueChange={setSelectedProduct}>
                        {(products || []).map(product => <div key={product.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setSelectedProduct(product.id)}>
                            <RadioGroupItem value={product.id} id={product.id} />
                            {product.image_url && <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-md" />}
                            <Label htmlFor={product.id} className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-muted-foreground">{product.liters}L</div>
                                </div>
                                <span className="text-primary font-bold">R$ {Number(product.price).toFixed(2)}</span>
                              </div>
                            </Label>
                          </div>)}
                      </RadioGroup>}
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label className="text-base">Quantidade</Label>
                    <div className="flex items-center justify-center gap-4">
                      <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(-1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                      <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {selectedProductData && <div className="text-center mt-2">
                        {discountPercentage > 0 ? <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Subtotal: <span className="line-through">R$ {subtotal.toFixed(2)}</span>
                            </p>
                            <p className="text-sm text-green-600 font-medium">
                              Desconto ({discountPercentage}%): -R$ {discountAmount.toFixed(2)}
                            </p>
                            <p className="text-primary font-bold text-xl">Total: R$ {total.toFixed(2)}</p>
                          </div> : <p className="text-primary font-bold text-xl">Total: R$ {total.toFixed(2)}</p>}
                      </div>}
                  </div>

                  {/* Container Year */}
                  <div className="space-y-3">
                    <Label className="text-base">Ano do Vasilhame</Label>
                    <p className="text-sm text-muted-foreground">
                      Informe o ano de fabricação do seu galão (geralmente gravado no fundo)
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="containerYearStart">Ano Inicial</Label>
                        <Input
                          id="containerYearStart"
                          type="text"
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="Ex: 2018"
                          value={containerYearStart}
                          onChange={(e) => setContainerYearStart(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="containerYearEnd">Ano Final</Label>
                        <Input
                          id="containerYearEnd"
                          type="text"
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="Ex: 2023"
                          value={containerYearEnd}
                          onChange={(e) => setContainerYearEnd(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-base flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Seu Nome
                      </Label>
                      <Input placeholder="Nome completo" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Telefone / WhatsApp
                      </Label>
                      <Input placeholder="(00) 00000-0000" value={customerPhone} onChange={e => setCustomerPhone(formatPhone(e.target.value))} maxLength={15} required />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Endereço de Entrega
                    </Label>
                    <Input placeholder="Rua, número, complemento, bairro" value={address} onChange={e => setAddress(e.target.value)} required />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Observações (opcional)
                    </Label>
                    <Textarea
                      placeholder="Ex: Entregar no portão lateral, tocar interfone 102..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <Label className="text-base flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Forma de Pagamento
                    </Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      {distribuidora.accepts_cash && <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value="dinheiro" id="dinheiro" />
                          <Label htmlFor="dinheiro" className="cursor-pointer flex-1">Dinheiro</Label>
                        </div>}
                      {distribuidora.accepts_pix && <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value="pix" id="pix" />
                          <Label htmlFor="pix" className="cursor-pointer flex-1">Pix</Label>
                        </div>}
                      {distribuidora.accepts_card && <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value="cartao" id="cartao" />
                          <Label htmlFor="cartao" className="cursor-pointer flex-1">Cartão na Entrega</Label>
                        </div>}
                    </RadioGroup>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={createOrder.isPending || !canSubmit}>
                    {createOrder.isPending ? "Processando..." : "Finalizar Pedido"}
                  </Button>

                  <div className="text-center">
                    <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                      Voltar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>)}
        </main>
      </div>

      {/* Redeem Confirmation Dialog */}
      <AlertDialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-amber-500" />
              Resgatar Recompensa
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Você vai resgatar: <strong>{loyaltyData?.program?.reward_description || 'Recompensa'}</strong>
              </p>
              <p>
                Serão usados <strong>{loyaltyData?.program?.reward_threshold} pontos</strong>.
              </p>
              <p className="text-sm text-muted-foreground">
                O distribuidor será notificado e a recompensa será aplicada no seu próximo pedido.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={redeemLoyalty.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRedeem}
              disabled={redeemLoyalty.isPending}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {redeemLoyalty.isPending ? "Processando..." : "Confirmar Resgate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>;
};
export default OrderPage;