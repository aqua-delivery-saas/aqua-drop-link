import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { Minus, Plus, Clock, Gift } from "lucide-react";
import { toast } from "sonner";
import { getDistribuidoraBySlug } from "@/data/mockData";
import { Helmet } from "react-helmet-async";

interface Product {
  id: string;
  name: string;
  price: number;
}

const OrderPage = () => {
  const navigate = useNavigate();
  const { distributorSlug } = useParams();
  
  const distribuidora = getDistribuidoraBySlug(distributorSlug || "");
  
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

  const products = distribuidora.products.map(p => ({
    id: p.id.toString(),
    name: p.name,
    price: p.price
  }));

  // Mock de cliente logado (simulando 8 pedidos já feitos)
  const mockCustomer = {
    isLoggedIn: false,
    name: "João Silva",
    orderCount: 8,
  };

  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // Verificar se está aberta
  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('pt-BR', { weekday: 'long' });
      const currentTime = now.toTimeString().slice(0, 5);
      
      const todaySchedule = distribuidora.businessHours.find(
        s => s.dia_semana.toLowerCase() === currentDay.toLowerCase()
      );
      
      if (!todaySchedule || !todaySchedule.ativo) {
        setIsOpen(false);
        return;
      }
      
      setIsOpen(currentTime >= todaySchedule.hora_abertura && currentTime <= todaySchedule.hora_fechamento);
    };

    checkIfOpen();
    const interval = setInterval(checkIfOpen, 60000);
    
    return () => clearInterval(interval);
  }, [distribuidora]);

  // Calcular desconto baseado na quantidade
  const calculateDiscount = (qty: number): number => {
    const { tier1, tier2 } = distribuidora.discounts;
    
    if (qty >= tier2.min) {
      return tier2.percentage;
    } else if (qty >= tier1.min && qty <= tier1.max) {
      return tier1.percentage;
    }
    return 0;
  };

  // Calcular progresso da fidelização
  const loyaltyProgress = mockCustomer.isLoggedIn 
    ? (mockCustomer.orderCount % distribuidora.loyalty.ordersRequired)
    : 0;
  const loyaltyRemaining = distribuidora.loyalty.ordersRequired - loyaltyProgress;

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOpen) {
      toast.error("Distribuidora fechada no momento");
      return;
    }

    if (!selectedProduct || !address || !paymentMethod) {
      toast.error("Preencha todos os campos obrigatórios");
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
          whatsappUrl: `https://wa.me/${distribuidora.whatsapp}?text=${encodeURIComponent(
            `Olá! Pedido:\n\nProduto: ${product?.name}\nQtd: ${quantity}\nTotal: R$ ${total.toFixed(2)}\nEndereço: ${address}\nPagamento: ${paymentMethod}`
          )}`,
        },
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

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={distribuidora.palavras_chave} />
      </Helmet>
      
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
        {!isOpen && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-center text-destructive font-medium">
                ⚠️ Distribuidora fechada no momento. Volte durante o horário de atendimento.
              </p>
            </CardContent>
          </Card>
        )}

        {distribuidora.loyalty.enabled && mockCustomer.isLoggedIn && (
          <Card className="border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Gift className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-primary">Programa de Fidelização Ativo</p>
                  <p className="text-sm text-muted-foreground">
                    Faltam apenas {loyaltyRemaining} pedidos para ganhar: {distribuidora.loyalty.reward}
                  </p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(loyaltyProgress / distribuidora.loyalty.ordersRequired) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedProduct(product.id)}
                    >
                      <RadioGroupItem value={product.id} id={product.id} />
                      <Label htmlFor={product.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-primary font-bold">R$ {product.price.toFixed(2)}</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Quantidade</Label>
                <div className="flex items-center gap-4">
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
                  {selectedProductData && (
                    <div className="ml-4 flex-1">
                      {discountPercentage > 0 ? (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Subtotal: <span className="line-through">R$ {subtotal.toFixed(2)}</span>
                          </p>
                          <p className="text-sm text-green-600 font-medium">
                            Desconto ({discountPercentage}%): -R$ {discountAmount.toFixed(2)}
                          </p>
                          <p className="text-primary font-bold text-xl">
                            Total: R$ {total.toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          Total: <span className="text-primary font-bold text-xl">
                            R$ {total.toFixed(2)}
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-base">Endereço de Entrega</Label>
                <Input
                  id="address"
                  placeholder="Rua, número, complemento"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
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

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Processando..." : "Fazer Pedido"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate("/customer/signup")}
                >
                  Criar conta para salvar seus endereços
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {products.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">Nenhuma marca disponível no momento.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
    </>
  );
};

export default OrderPage;
