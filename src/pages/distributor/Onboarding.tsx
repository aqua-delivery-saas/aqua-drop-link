import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Loader2, RefreshCw } from "lucide-react";
import { OnboardingStep1 } from "@/components/onboarding/OnboardingStep1";
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2";
import { OnboardingStep3A, MarcaSelecionada } from "@/components/onboarding/OnboardingStep3A";
import { OnboardingStep3B } from "@/components/onboarding/OnboardingStep3B";
import { OnboardingStep4 } from "@/components/onboarding/OnboardingStep4";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useDistributor } from "@/hooks/useDistributor";
import { useCreateDistributor } from "@/hooks/useCreateDistributor";
import { useOnboardingDraft, useSaveOnboardingDraft, useDeleteOnboardingDraft } from "@/hooks/useOnboardingDraft";

export interface OnboardingData {
  distributor?: {
    name: string;
    cnpj: string;
    phone: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    zip_code: string;
    city: string;
    state: string;
    city_id?: string | null;
    logo_url?: string;
    pix_key?: string;
  };
  businessHours?: {
    [key: string]: { open: string; close: string; active: boolean };
  };
  marcasSelecionadas?: MarcaSelecionada[];
  products?: MarcaSelecionada[];
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { data: existingDistributor, isLoading: distributorLoading } = useDistributor();
  const createDistributor = useCreateDistributor();
  
  // Draft hooks
  const { data: draft, isLoading: draftLoading } = useOnboardingDraft();
  const saveDraft = useSaveOnboardingDraft();
  const deleteDraft = useDeleteOnboardingDraft();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isResumingDraft, setIsResumingDraft] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Load draft data when available
  useEffect(() => {
    if (draft && !draftLoaded) {
      setCurrentStep(draft.current_step);
      
      // Convert draft data with proper defaults for required fields
      const distributorData = draft.distributor_data ? {
        name: draft.distributor_data.name || '',
        cnpj: draft.distributor_data.cnpj || '',
        phone: draft.distributor_data.phone || '',
        street: draft.distributor_data.street || '',
        number: draft.distributor_data.number || '',
        complement: draft.distributor_data.complement,
        neighborhood: draft.distributor_data.neighborhood || '',
        zip_code: draft.distributor_data.zip_code || '',
        city: draft.distributor_data.city || '',
        state: draft.distributor_data.state || '',
        city_id: draft.distributor_data.city_id,
      } : undefined;
      
      // Convert brands/products with required logo field
      const convertBrands = (brands: typeof draft.brands_data): MarcaSelecionada[] | undefined => {
        if (!brands) return undefined;
        return brands.map(b => ({
          id: b.id,
          nome: b.nome,
          litros: b.litros,
          logo: b.logo || '',
          preco: b.preco,
        }));
      };
      
      setOnboardingData({
        distributor: distributorData,
        businessHours: draft.business_hours_data || undefined,
        marcasSelecionadas: convertBrands(draft.brands_data),
        products: convertBrands(draft.products_data),
      });
      setIsResumingDraft(true);
      setDraftLoaded(true);
      
      toast.info("Progresso recuperado", {
        description: `Retomando do passo ${draft.current_step}`,
        duration: 4000,
      });
    }
  }, [draft, draftLoaded]);

  // Load initial data from sessionStorage (from signup) only if no draft
  useEffect(() => {
    if (draftLoading || draft) return;
    
    const signupData = sessionStorage.getItem('distributorSignup');
    if (signupData) {
      try {
        const parsed = JSON.parse(signupData);
        setOnboardingData(prev => ({
          ...prev,
          distributor: {
            name: parsed.name || '',
            cnpj: '',
            phone: parsed.whatsapp || '',
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            zip_code: '',
            city: '',
            state: '',
          }
        }));
      } catch (e) {
        console.error('Error parsing signup data:', e);
      }
    }
  }, [draftLoading, draft]);

  // Redirect if not authenticated or already has distributor
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/distributor/login');
      return;
    }
    
    if (!distributorLoading && existingDistributor) {
      navigate('/distributor/dashboard');
    }
  }, [authLoading, isAuthenticated, distributorLoading, existingDistributor, navigate]);

  // Total de passos visuais (3A e 3B contam como passo 3)
  const totalSteps = 4;
  
  // Calcula progresso considerando sub-passos
  const getProgress = () => {
    if (currentStep <= 2) return (currentStep / totalSteps) * 100;
    if (currentStep === 3) return (2.5 / totalSteps) * 100; // 3A = metade do passo 3
    if (currentStep === 4) return (3 / totalSteps) * 100; // 3B = fim do passo 3
    return (currentStep - 1) / totalSteps * 100; // Passo 4 = step 5
  };

  const steps = [
    { number: 1, title: "Dados da Distribuidora" },
    { number: 2, title: "Horários" },
    { number: 3, title: "Marcas e Preços" },
    { number: 4, title: "Link de Pedido" },
  ];

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber === 3) {
      // Passo 3 está completo se currentStep > 4 (3B concluído)
      if (currentStep > 4) return "completed";
      // Passo 3 está ativo se currentStep é 3 ou 4 (3A ou 3B)
      if (currentStep === 3 || currentStep === 4) return "active";
      return "pending";
    }
    if (stepNumber === 4) {
      if (currentStep === 5) return "active";
      if (currentStep > 5) return "completed";
      return "pending";
    }
    if (currentStep > stepNumber) return "completed";
    if (currentStep === stepNumber) return "active";
    return "pending";
  };

  const handleNext = async (data: Partial<OnboardingData>) => {
    const newData = { ...onboardingData, ...data };
    setOnboardingData(newData);
    
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    // Save draft to database
    try {
      await saveDraft.mutateAsync({
        current_step: nextStep,
        distributor_data: newData.distributor || null,
        business_hours_data: newData.businessHours || null,
        brands_data: newData.marcasSelecionadas || null,
        products_data: newData.products || null,
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      // Don't show error to user, draft saving is background operation
    }
  };

  const handleBack = async () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Save updated step to draft
      try {
        await saveDraft.mutateAsync({
          current_step: prevStep,
          distributor_data: onboardingData.distributor || null,
          business_hours_data: onboardingData.businessHours || null,
          brands_data: onboardingData.marcasSelecionadas || null,
          products_data: onboardingData.products || null,
        });
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }
  };

  const handleFinish = async () => {
    if (!user?.id) {
      toast.error("Usuário não autenticado");
      return;
    }

    setIsSaving(true);

    try {
      // Get email from sessionStorage (saved during signup)
      const signupData = sessionStorage.getItem('distributorSignup');
      const signupEmail = signupData ? JSON.parse(signupData).email : null;

      // Prepare products from marcasSelecionadas with brand_id
      const products = (onboardingData.products || []).map(marca => ({
        brandId: marca.id,
        name: marca.nome,
        liters: marca.litros,
        price: marca.preco || 0,
      }));

      // Create distributor with all data
      await createDistributor.mutateAsync({
        distributor: {
          name: onboardingData.distributor?.name || '',
          cnpj: onboardingData.distributor?.cnpj,
          phone: onboardingData.distributor?.phone,
          whatsapp: onboardingData.distributor?.phone,
          email: signupEmail,
          street: onboardingData.distributor?.street,
          number: onboardingData.distributor?.number,
          complement: onboardingData.distributor?.complement,
          neighborhood: onboardingData.distributor?.neighborhood,
          zip_code: onboardingData.distributor?.zip_code,
          city: onboardingData.distributor?.city,
          state: onboardingData.distributor?.state,
          city_id: onboardingData.distributor?.city_id,
          logo_url: onboardingData.distributor?.logo_url,
        },
        businessHours: onboardingData.businessHours,
        products,
      });

      // Delete the draft after successful completion
      await deleteDraft.mutateAsync();

      // Clear signup data from sessionStorage
      sessionStorage.removeItem('distributorSignup');

      toast.success("Configuração concluída com sucesso!");
      navigate("/distributor/subscription");
    } catch (error) {
      console.error('Error finishing onboarding:', error);
      toast.error("Erro ao salvar dados", {
        description: "Tente novamente",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1 onNext={handleNext} initialData={onboardingData.distributor} />;
      case 2:
        return <OnboardingStep2 onNext={handleNext} onBack={handleBack} initialData={onboardingData.businessHours} />;
      case 3:
        return (
          <OnboardingStep3A 
            onNext={handleNext} 
            onBack={handleBack} 
            initialData={onboardingData.marcasSelecionadas} 
          />
        );
      case 4:
        return (
          <OnboardingStep3B 
            onNext={handleNext} 
            onBack={handleBack} 
            marcasSelecionadas={onboardingData.marcasSelecionadas || []} 
          />
        );
      case 5:
        return <OnboardingStep4 onFinish={handleFinish} onBack={handleBack} distributorData={onboardingData.distributor} />;
      default:
        return null;
    }
  };

  // Show loading while checking auth/distributor/draft status
  if (authLoading || distributorLoading || draftLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Configuração Inicial - Água em Casa</title>
        <meta name="description" content="Configure sua distribuidora em poucos passos" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Água em Casa</h1>
            <p className="text-muted-foreground">Configure sua distribuidora em {totalSteps} passos simples</p>
          </div>

          <Card className="p-8 shadow-lg">
            {/* Resume indicator */}
            {isResumingDraft && (
              <div className="mb-4 p-3 bg-primary/10 rounded-lg flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">
                  Retomando de onde você parou
                </span>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-8">
              <Progress value={getProgress()} className="h-2 mb-4" />
              <div className="flex justify-between">
                {steps.map((step) => {
                  const status = getStepStatus(step.number);
                  return (
                    <div key={step.number} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                          status === "completed"
                            ? "bg-primary text-primary-foreground"
                            : status === "active"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {status === "completed" ? <Check className="w-5 h-5" /> : step.number}
                      </div>
                      <span className="text-xs text-center hidden sm:block">{step.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px] relative">
              {isSaving && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Salvando dados...</span>
                  </div>
                </div>
              )}
              {renderStep()}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
