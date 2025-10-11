import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Logo } from "@/components/Logo";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
}

const OrderPage = () => {
  const navigate = useNavigate();
  const { distributorSlug } = useParams();
  
  const products: Product[] = [
    { id: "1", name: "Água Mineral Crystal", price: 8.50 },
    { id: "2", name: "Água Mineral Indaiá", price: 9.00 },
    { id: "3", name: "Água Mineral São Lourenço", price: 7.50 },
    { id: "5", name: "Água Mineral Bonafont", price: 9.50 },
  ];

  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !address || !paymentMethod) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const product = products.find(p => p.id === selectedProduct);
      navigate("/order/confirmation", {
        state: {
          product: product?.name,
          quantity,
          address,
          paymentMethod,
          total: (product?.price || 0) * quantity,
          distributor: "Distribuidora Água Pura",
        },
      });
      setLoading(false);
    }, 1000);
  };

  const selectedProductData = products.find(p => p.id === selectedProduct);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Logo size="md" />
          <p className="text-sm text-muted-foreground mt-1">Distribuidora Água Pura</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
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
                    <span className="ml-4 text-muted-foreground">
                      Total: <span className="text-primary font-bold text-xl">
                        R$ {(selectedProductData.price * quantity).toFixed(2)}
                      </span>
                    </span>
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
  );
};

export default OrderPage;
