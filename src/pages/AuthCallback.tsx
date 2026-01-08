import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setRole } = useAuth();
  const [status, setStatus] = useState("Processando autenticação...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session after OAuth redirect
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session?.user) {
          throw new Error("Sessão não encontrada");
        }

        setStatus("Verificando conta...");

        const userId = session.user.id;
        const userEmail = session.user.email;
        const userName = session.user.user_metadata?.full_name || 
                        session.user.user_metadata?.name ||
                        userEmail?.split("@")[0] || "Usuário";

        // Get account type from URL params (customer or distributor)
        const accountType = searchParams.get("type") || "customer";
        const redirectPath = searchParams.get("redirect");

        // Check if user already has roles
        const { data: isCustomer } = await supabase.rpc("has_role", {
          _user_id: userId,
          _role: "customer",
        });

        const { data: isDistributor } = await supabase.rpc("has_role", {
          _user_id: userId,
          _role: "distributor",
        });

        // If user already has distributor role, redirect to distributor area
        if (isDistributor) {
          setRole("distributor");
          toast.success("Bem-vindo de volta!");
          navigate(redirectPath || "/distributor/dashboard", { replace: true });
          return;
        }

        // If user already has customer role, redirect to customer area
        if (isCustomer) {
          setRole("customer");
          toast.success("Bem-vindo de volta!");
          navigate(redirectPath || "/customer/history", { replace: true });
          return;
        }

        // New user - assign role based on account type
        setStatus("Configurando sua conta...");

        const roleToAssign = accountType === "distributor" ? "distributor" : "customer";

        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: roleToAssign });

        if (roleError && !roleError.message.includes("duplicate")) {
          console.error("Error assigning role:", roleError);
        }

        // Update profile with OAuth data
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: userId,
            full_name: userName,
          }, { onConflict: "id" });

        if (profileError) {
          console.error("Error updating profile:", profileError);
        }

        // Set role and redirect based on account type
        if (accountType === "distributor") {
          setRole("distributor");
          toast.success("Conta criada com sucesso!", {
            description: "Complete o cadastro da sua distribuidora",
          });
          navigate("/distributor/onboarding", { replace: true });
        } else {
          setRole("customer");
          toast.success("Conta criada com sucesso!");
          navigate(redirectPath || "/customer/history", { replace: true });
        }

      } catch (error: any) {
        console.error("Auth callback error:", error);
        toast.error("Erro na autenticação", { description: error.message });
        navigate("/customer/login", { replace: true });
      }
    };

    handleCallback();
  }, [navigate, searchParams, setRole]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="text-lg text-muted-foreground">{status}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
