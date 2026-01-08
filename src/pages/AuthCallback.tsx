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

        // Check if user already has a role
        const { data: existingRole } = await supabase.rpc("has_role", {
          _user_id: userId,
          _role: "customer",
        });

        const { data: isDistributor } = await supabase.rpc("has_role", {
          _user_id: userId,
          _role: "distributor",
        });

        // If user has distributor role, redirect to distributor dashboard
        if (isDistributor) {
          setRole("distributor");
          toast.success("Bem-vindo de volta!");
          navigate("/distributor/dashboard", { replace: true });
          return;
        }

        // If user already has customer role, redirect
        if (existingRole) {
          setRole("customer");
          const redirectPath = searchParams.get("redirect") || "/customer/history";
          toast.success("Bem-vindo de volta!");
          navigate(redirectPath, { replace: true });
          return;
        }

        setStatus("Configurando sua conta...");

        // Assign customer role for new OAuth users
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: "customer" });

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

        setRole("customer");
        toast.success("Conta criada com sucesso!");
        
        const redirectPath = searchParams.get("redirect") || "/customer/history";
        navigate(redirectPath, { replace: true });

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
