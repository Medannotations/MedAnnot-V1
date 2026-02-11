import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function SubscriptionGuard({ children }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    const hasToken = localStorage.getItem('medannot_token');

    // Pas de token → accueil
    if (!hasToken || !user) {
      navigate("/", { replace: true });
      return;
    }

    // Paiement en attente → page de paiement
    if (!profile || profile.subscription_status === 'pending_payment') {
      navigate("/pending-payment", { replace: true });
      return;
    }
  }, [user, profile, isLoading, navigate]);

  // Chargement en cours
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Bloquer si pas d'user ou pas de profil valide
  if (!user || !profile) return null;
  if (profile.subscription_status === 'pending_payment') return null;

  return <>{children}</>;
}
