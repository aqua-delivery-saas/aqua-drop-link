import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Loader2 } from "lucide-react";
import { OnboardingStep1 } from "@/components/onboarding/OnboardingStep1";
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2";
import { OnboardingStep3A, MarcaSelecionada } from "@/components/onboarding/OnboardingStep3A";
import { OnboardingStep3B } from "@/components/onboarding/OnboardingStep3B";
import { OnboardingStep4 } from "@/components/onboarding/OnboardingStep4";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useDistributor } from "@/hooks/useDistributor";
import { useCreateDistributor } from "@/hooks/useCreateDistributor";

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
    logo?: File;
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
  
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load initial data from sessionStorage (from signup)
  useEffect(() => {
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
  }, []);

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

  const handleNext = (data: Partial<OnboardingData>) => {
    setOnboardingData({ ...onboardingData, ...data });
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
        },
        businessHours: onboardingData.businessHours,
        products,
      });

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

  // Show loading while checking auth/distributor status
  if (authLoading || distributorLoading) {
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
