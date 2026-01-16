import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useCallback, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { cnpjSchema, phoneSchema, whatsappSchema, nameSchema, formatCNPJ, formatPhone } from "@/lib/validators";
import { useCepLookup } from "@/hooks/useCepLookup";
import { findCityByNameAndState } from "@/hooks/useCities";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: nameSchema,
  cnpj: cnpjSchema,
  phone: phoneSchema,
  whatsapp: whatsappSchema,
  pix_key: z.string().max(100, "Chave PIX muito longa").optional(),
  zip_code: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido (formato: 00000-000)"),
  street: z.string().min(3, "Rua deve ter pelo menos 3 caracteres").max(200, "Rua muito longa"),
  number: z.string().min(1, "Número é obrigatório").max(20, "Número muito longo"),
  complement: z.string().max(100, "Complemento muito longo").optional(),
  neighborhood: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres").max(100, "Bairro muito longo"),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres").max(100, "Cidade muito longa"),
  city_id: z.string().nullable().optional(),
  state: z.string().length(2, "Estado é obrigatório"),
});

interface OnboardingStep1Props {
  onNext: (data: any) => void;
  initialData?: z.infer<typeof formSchema> & { logo_url?: string };
}

export const OnboardingStep1 = ({ onNext, initialData }: OnboardingStep1Props) => {
  const { toast } = useToast();
  const { fetchAddress, isLoading: isCepLoading, error: cepError, clearError } = useCepLookup();
  
  // Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      cnpj: "",
      phone: "",
      whatsapp: "",
      pix_key: "",
      zip_code: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      city_id: null,
      state: "",
    },
  });

  const formatCep = (value: string) => {
    let cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 5) {
      cleaned = cleaned.slice(0, 5) + '-' + cleaned.slice(5, 8);
    }
    return cleaned;
  };

  const handleCepChange = useCallback(async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {
      const address = await fetchAddress(cleanCep);
      
      if (address) {
        form.setValue("street", address.street);
        form.setValue("neighborhood", address.neighborhood);
        form.setValue("city", address.city);
        form.setValue("state", address.state);
        
        // Check if city exists in database
        try {
          const existingCity = await findCityByNameAndState(address.city, address.state);
          form.setValue("city_id", existingCity?.id || null);
        } catch {
          form.setValue("city_id", null);
        }
        
        // Clear validation errors for auto-filled fields
        form.clearErrors(["street", "neighborhood", "city", "state"]);
      }
    }
  }, [fetchAddress, form]);

  useEffect(() => {
    if (cepError) {
      toast({
        title: "CEP não encontrado",
        description: "Verifique o CEP digitado e tente novamente.",
        variant: "destructive",
      });
      clearError();
    }
  }, [cepError, toast, clearError]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Selecione uma imagem (PNG, JPG ou WEBP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo é 2MB",
        variant: "destructive",
      });
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let logoUrl: string | undefined = initialData?.logo_url;

    if (logoFile) {
      setIsUploading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) throw new Error('Usuário não autenticado');

        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('distributor-logos')
          .upload(fileName, logoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('distributor-logos')
          .getPublicUrl(fileName);

        logoUrl = publicUrl;
      } catch (error) {
        console.error('Logo upload error:', error);
        toast({
          title: "Erro no upload",
          description: "Não foi possível enviar a logo. Tente novamente.",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    onNext({ distributor: { ...values, logo_url: logoUrl } });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2">Dados da Distribuidora</h2>
          <p className="text-muted-foreground">Preencha as informações básicas da sua empresa</p>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Distribuidora *</FormLabel>
              <FormControl>
                <Input placeholder="Água Cristalina Ltda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="00.000.000/0000-00" 
                  {...field}
                  onChange={(e) => {
                    const formatted = formatCNPJ(e.target.value);
                    field.onChange(formatted);
                  }}
                />
              </FormControl>
              <FormDescription>Formato: XX.XXX.XXX/XXXX-XX</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone Comercial *</FormLabel>
                <FormControl>
                  <Input 
                    type="tel"
                    placeholder="(00) 00000-0000" 
                    {...field}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                </FormControl>
                <FormDescription>Número de contato da distribuidora</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Comercial *</FormLabel>
                <FormControl>
                  <Input 
                    type="tel"
                    placeholder="(00) 90000-0000" 
                    {...field}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                </FormControl>
                <FormDescription>Receberá notificações de novos pedidos</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="pix_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave PIX (opcional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="CPF, CNPJ, email, telefone ou chave aleatória" 
                  {...field}
                />
              </FormControl>
              <FormDescription>Será exibida para clientes que pagarem via PIX</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zip_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="00000-000" 
                    {...field}
                    onChange={(e) => {
                      const formatted = formatCep(e.target.value);
                      field.onChange(formatted);
                      handleCepChange(formatted);
                    }}
                  />
                  {isCepLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>Digite o CEP para preencher o endereço automaticamente</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rua/Logradouro *</FormLabel>
              <FormControl>
                <Input placeholder="Rua das Flores" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número *</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complement"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input placeholder="Sala 101, Bloco A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro *</FormLabel>
              <FormControl>
                <Input placeholder="Centro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled 
                    placeholder="UF"
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Cidade *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled 
                    placeholder="Preenchido pelo CEP"
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Logo da Distribuidora (opcional)</Label>
          <div 
            className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {logoPreview ? (
              <div className="flex flex-col items-center">
                <img 
                  src={logoPreview} 
                  alt="Preview da logo" 
                  className="w-24 h-24 object-contain mb-2 rounded"
                />
                <p className="text-sm text-muted-foreground">Clique para alterar</p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Adicionar logo da distribuidora</p>
                <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP (máx 2MB)</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Próximo"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
