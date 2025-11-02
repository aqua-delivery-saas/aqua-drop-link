import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";
import { OnboardingStep1 } from "@/components/onboarding/OnboardingStep1";
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2";
import { OnboardingStep3 } from "@/components/onboarding/OnboardingStep3";
import { OnboardingStep4 } from "@/components/onboarding/OnboardingStep4";
import { toast } from "sonner";

export interface OnboardingData {
  distributor?: {
    name: string;
    cnpj: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    logo?: File;
  };
  businessHours?: {
    [key: string]: { open: string; close: string; active: boolean };
  };
  products?: Array<{
    name: string;
    price: number;
    stock: number;
    description: string;
  }>;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: "Dados da Distribuidora" },
    { number: 2, title: "Horários de Funcionamento" },
    { number: 3, title: "Adicionar Produtos" },
    { number: 4, title: "Link de Pedido" },
  ];

  const handleNext = (data: Partial<OnboardingData>) => {
    setOnboardingData({ ...onboardingData, ...data });
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    toast.success("Configuração concluída com sucesso!");
    navigate("/distributor/dashboard");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1 onNext={handleNext} initialData={onboardingData.distributor} />;
      case 2:
        return <OnboardingStep2 onNext={handleNext} onBack={handleBack} initialData={onboardingData.businessHours} />;
      case 3:
        return <OnboardingStep3 onNext={handleNext} onBack={handleBack} initialData={onboardingData.products} />;
      case 4:
        return <OnboardingStep4 onFinish={handleFinish} onBack={handleBack} distributorData={onboardingData.distributor} />;
      default:
        return null;
    }
  };

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
              <Progress value={progress} className="h-2 mb-4" />
              <div className="flex justify-between">
                {steps.map((step) => (
                  <div key={step.number} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                        currentStep > step.number
                          ? "bg-primary text-primary-foreground"
                          : currentStep === step.number
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                    </div>
                    <span className="text-xs text-center hidden sm:block">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">{renderStep()}</div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
