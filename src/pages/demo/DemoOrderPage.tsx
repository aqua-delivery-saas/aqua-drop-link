import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { Minus, Plus, MapPin, CreditCard, User, Phone, Star, Gift, AlertTriangle, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { formatPhone } from "@/lib/validators";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { Progress } from "@/components/ui/progress";

// Mock data for demonstration
const mockDistributor = {
  id: "demo-distributor",
  name: "Distribuidora Exemplo",
  slug: "demo",
  whatsapp: "5511999999999",
  accepts_pix: true,
  accepts_card: true,
  accepts_cash: true,
  pix_key: "contato@distribuidoraexemplo.com.br"
};
const mockProducts = [{
  id: "1",
  name: "Galão 20L Premium",
  liters: 20,
  price: 12.00
}, {
  id: "2",
  name: "Galão 10L",
  liters: 10,
  price: 8.00
}, {
  id: "3",
  name: "Garrafão 5L",
  liters: 5,
  price: 5.00
}];
const mockDiscountRules = [{
  min_quantity: 3,
  max_quantity: 5,
  discount_percent: 5
}, {
  min_quantity: 6,
  max_quantity: null,
  discount_percent: 10
}];
const mockLoyaltyProgram = {
  program_name: "Clube Fidelidade",
  points_per_order: 1,
  reward_threshold: 10,
  reward_description: "1 Galão 20L Grátis",
  min_order_value: 0
};
const mockLoyaltyPoints = {
  available_points: 7,
  total_points: 12,
  redeemed_points: 5
};
const DemoOrderPage = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Calculate discount based on quantity
  const calculateDiscount = (qty: number): number => {
    const applicableRule = mockDiscountRules.filter(rule => qty >= rule.min_quantity && (!rule.max_quantity || qty <= rule.max_quantity)).sort((a, b) => b.discount_percent - a.discount_percent)[0];
    return applicableRule ? applicableRule.discount_percent : 0;
  };
  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };
  const canSubmit = useMemo(() => {
    return selectedProduct && address && paymentMethod && customerName && customerPhone;
  }, [selectedProduct, address, paymentMethod, customerName, customerPhone]);
  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    const product = mockProducts.find(p => p.id === selectedProduct);
    if (!product) return;
    const subtotalValue = product.price * quantity;
    const discountPercentage = calculateDiscount(quantity);
    const discountAmountValue = subtotalValue * (discountPercentage / 100);
    const totalValue = subtotalValue - discountAmountValue;
    navigate("/demo/confirmation", {
      state: {
        orderId: "demo-order-001",
        orderNumber: "2024001234",
        product: product.name,
        quantity,
        address,
        paymentMethod,
        subtotal: subtotalValue,
        discount: discountAmountValue,
        total: totalValue,
        distributor: mockDistributor.name,
        isScheduled: false,
        pixKey: mockDistributor.pix_key,
        whatsappUrl: `https://wa.me/${mockDistributor.whatsapp}?text=${encodeURIComponent(`[DEMO] Olá! Pedido de demonstração:\n\nProduto: ${product.name}\nQtd: ${quantity}\nTotal: R$ ${totalValue.toFixed(2)}`)}`
      }
    });
  };
  const selectedProductData = mockProducts.find(p => p.id === selectedProduct);
  const subtotal = selectedProductData ? selectedProductData.price * quantity : 0;
  const discountPercentage = calculateDiscount(quantity);
  const discountAmount = subtotal * (discountPercentage / 100);
  const total = subtotal - discountAmount;
  return <>
      <Helmet>
        <title>Demonstração - Página de Pedido</title>
        <meta name="description" content="Demonstração do sistema de pedidos para distribuidoras" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Demo Banner */}
      <div className="bg-amber-500 text-amber-950 text-center py-2 px-4 text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <Info className="h-4 w-4" />
          <span>MODO DEMONSTRAÇÃO - Explore como seus clientes farão pedidos</span>
        </div>
      </div>

      <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <Logo size="md" />
                <p className="text-sm text-muted-foreground mt-1">{mockDistributor.name}</p>
              </div>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                Demo
              </Badge>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-2xl space-y-4">
          {/* Loyalty Points Card - Demo */}
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                <span className="font-medium text-amber-800">{mockLoyaltyProgram.program_name}</span>
                <Badge variant="outline" className="ml-auto text-xs bg-amber-100 text-amber-700 border-amber-300">
                  Exemplo
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-amber-700">
                  Você tem <strong>{mockLoyaltyPoints.available_points}</strong> de{' '}
                  <strong>{mockLoyaltyProgram.reward_threshold}</strong> pontos para resgatar:{' '}
                  <span className="font-medium">{mockLoyaltyProgram.reward_description}</span>
                </p>
                <Progress value={mockLoyaltyPoints.available_points / mockLoyaltyProgram.reward_threshold * 100} className="h-2 bg-amber-200" />
                <p className="text-xs text-amber-600">
                  +{mockLoyaltyProgram.points_per_order} ponto(s) por pedido
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status Card - Always Open in Demo */}
          

          <form onSubmit={handleOrder} className="space-y-4">
            {/* Product Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  Escolha o Produto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selectedProduct} onValueChange={setSelectedProduct} className="space-y-3">
                  {mockProducts.map(product => <div key={product.id} className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${selectedProduct === product.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`} onClick={() => setSelectedProduct(product.id)}>
                      <RadioGroupItem value={product.id} id={product.id} />
                      <Label htmlFor={product.id} className="flex-1 cursor-pointer flex justify-between items-center">
                        <div>
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({product.liters}L)
                          </span>
                        </div>
                        <span className="font-bold text-primary">
                          R$ {product.price.toFixed(2)}
                        </span>
                      </Label>
                    </div>)}
                </RadioGroup>

                {selectedProduct && <div className="flex items-center justify-center gap-4 pt-2">
                    <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-2xl font-bold w-12 text-center">
                      {quantity}
                    </span>
                    <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>}

                {/* Discount Info */}
                {discountPercentage > 0 && <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      🎉 Desconto de {discountPercentage}% aplicado!
                    </span>
                  </div>}
                {discountPercentage === 0 && quantity >= 2 && <div className="bg-muted/50 rounded-lg p-3 text-center text-sm text-muted-foreground">
                    <span>💡 Compre {3 - quantity} ou mais para ganhar 5% de desconto!</span>
                  </div>}
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Seus Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nome completo *</Label>
                  <Input id="customerName" placeholder="Seu nome" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefone/WhatsApp *
                  </Label>
                  <Input id="customerPhone" placeholder="(00) 00000-0000" value={customerPhone} onChange={e => setCustomerPhone(formatPhone(e.target.value))} maxLength={15} />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço completo *</Label>
                  <Input id="address" placeholder="Rua, número, bairro" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea id="notes" placeholder="Ex: Apartamento 101, deixar na portaria..." value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Forma de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  {mockDistributor.accepts_pix && <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${paymentMethod === "pix" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`} onClick={() => setPaymentMethod("pix")}>
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="cursor-pointer flex-1">
                        PIX
                      </Label>
                    </div>}
                  {mockDistributor.accepts_cash && <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${paymentMethod === "dinheiro" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`} onClick={() => setPaymentMethod("dinheiro")}>
                      <RadioGroupItem value="dinheiro" id="dinheiro" />
                      <Label htmlFor="dinheiro" className="cursor-pointer flex-1">
                        Dinheiro
                      </Label>
                    </div>}
                  {mockDistributor.accepts_card && <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${paymentMethod === "cartao" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`} onClick={() => setPaymentMethod("cartao")}>
                      <RadioGroupItem value="cartao" id="cartao" />
                      <Label htmlFor="cartao" className="cursor-pointer flex-1">
                        Cartão na Entrega
                      </Label>
                    </div>}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Summary */}
            {selectedProduct && <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto ({discountPercentage}%)</span>
                      <span>-R$ {discountAmount.toFixed(2)}</span>
                    </div>}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>}

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
              Confirmar Pedido (Demo)
            </Button>
          </form>

          {/* Demo Notice */}
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Modo Demonstração</p>
                  <p className="text-amber-700">
                    Nenhum pedido real será criado. Esta é uma prévia de como seus clientes 
                    farão pedidos através do sistema.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>;
};
export default DemoOrderPage;