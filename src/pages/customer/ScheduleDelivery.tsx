import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { Minus, Plus, MapPin, CreditCard, Calendar } from "lucide-react";
import { toast } from "sonner";
import { getDistribuidoraBySlug } from "@/data/mockData";
import { Helmet } from "react-helmet-async";
import { DeliveryScheduler } from "@/components/customer/DeliveryScheduler";

interface Product {
  id: string;
  name: string;
  litros: number;
  price: number;
  foto?: string;
}

const ScheduleDelivery = () => {
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
    litros: p.litros,
    price: p.price,
    foto: p.foto
  }));

  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !selectedDate || !selectedTime || !address || !paymentMethod) {
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

      navigate("/schedule/confirmation", {
        state: {
          product: product?.name,
          quantity,
          address,
          paymentMethod,
          subtotal,
          discount: discountAmount,
          total,
          distributor: distribuidora.nome,
          scheduledDate: selectedDate.toLocaleDateString('pt-BR'),
          scheduledTime: selectedTime,
          whatsappUrl: `https://wa.me/${distribuidora.whatsapp}?text=${encodeURIComponent(
            `Olá! Agendamento de Entrega:\n\nProduto: ${product?.name}\nQtd: ${quantity}\nData: ${selectedDate.toLocaleDateString('pt-BR')}\nHorário: ${selectedTime}\nTotal: R$ ${total.toFixed(2)}\nEndereço: ${address}\nPagamento: ${paymentMethod}`
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

  const pageTitle = `${distribuidora.nome} - Agendar Entrega`;
  const pageDescription = `Agende sua entrega de água mineral com ${distribuidora.nome}`;

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
            {/* Seleção de Produto */}
            <Card>
              <CardHeader>
                <CardTitle>1. Escolha o Produto</CardTitle>
                <CardDescription>Selecione a marca e quantidade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base">Marca</Label>
                  <RadioGroup value={selectedProduct} onValueChange={setSelectedProduct}>
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedProduct(product.id)}
                      >
                        <RadioGroupItem value={product.id} id={`schedule-${product.id}`} />
                        {product.foto && (
                          <img 
                            src={product.foto} 
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                        <Label htmlFor={`schedule-${product.id}`} className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">{product.litros}L</div>
                            </div>
                            <span className="text-primary font-bold">R$ {product.price.toFixed(2)}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
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
              </CardContent>
            </Card>

            {/* Seleção de Data e Horário */}
            <div>
              <h3 className="text-xl font-semibold mb-3">2. Escolha Data e Horário</h3>
              <DeliveryScheduler
                businessHours={distribuidora.businessHours}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                selectedTime={selectedTime}
                onTimeChange={setSelectedTime}
              />
            </div>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  3. Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  4. Forma de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                    <Label htmlFor="schedule-pix" className="cursor-pointer flex-1">Pix</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Resumo */}
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
              disabled={loading || !selectedProduct || !selectedDate || !selectedTime || !address || !paymentMethod}
            >
              {loading ? "Processando..." : "Confirmar Agendamento"}
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
