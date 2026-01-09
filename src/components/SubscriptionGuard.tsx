import { Navigate, useLocation } from "react-router-dom";
import { useDistributor } from "@/hooks/useDistributor";
import { useStripeSubscription } from "@/hooks/useStripeSubscription";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { data: distributor, isLoading: distributorLoading } = useDistributor();
  const { subscription, isLoading: subscriptionLoading } = useStripeSubscription();
  const location = useLocation();
  const hasShownOnboardingToast = useRef(false);

  // Páginas permitidas sem assinatura ativa
  const allowedPaths = [
    "/distributor/subscription",
    "/distributor/onboarding",
    "/distributor/profile",
  ];

  const isAllowedPath = allowedPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  // Show toast when redirecting to onboarding
  useEffect(() => {
    if (!distributorLoading && !distributor && !hasShownOnboardingToast.current) {
      // Only show toast once per session
      const hasShownInSession = sessionStorage.getItem('onboarding_redirect_toast');
      if (!hasShownInSession) {
        toast.info("Complete seu cadastro", {
          description: "Você precisa finalizar a configuração da sua distribuidora para acessar o painel.",
          duration: 5000,
        });
        sessionStorage.setItem('onboarding_redirect_toast', 'true');
        hasShownOnboardingToast.current = true;
      }
    }
  }, [distributorLoading, distributor]);

  // Se está carregando, mostrar skeleton
  if (distributorLoading || subscriptionLoading) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  // Se não tem distribuidor cadastrado, redirecionar para onboarding
  if (!distributor) {
    return <Navigate to="/distributor/onboarding" replace />;
  }

  // Verifica se tem assinatura ativa (dupla verificação: status + data)
  const isExpired = subscription?.subscription_end 
    ? new Date(subscription.subscription_end) < new Date() 
    : false;

  const hasActiveSubscription = subscription?.status === "active" && !isExpired;

  // Se não tem assinatura ativa e não está em página permitida, redirecionar
  if (!hasActiveSubscription && !isAllowedPath) {
    return <Navigate to="/distributor/subscription" replace />;
  }

  return <>{children}</>;
}
