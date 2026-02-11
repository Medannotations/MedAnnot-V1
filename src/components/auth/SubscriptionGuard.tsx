import { ReactNode, useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ALLOWED_STATUSES = ["trialing", "active"];

interface ProtectedRouteProps {
  children: ReactNode;
}

export function SubscriptionGuard({ children }: ProtectedRouteProps) {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const hasRefreshed = useRef(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isLoading || refreshing) return;

    const hasToken = localStorage.getItem('medannot_token');

    // Pas de token ou pas d'user → accueil
    if (!hasToken || !user) {
      navigate("/", { replace: true });
      return;
    }

    // Si pas de profil ou statut non autorise, essayer de rafraichir une fois
    const hasAccess = profile && ALLOWED_STATUSES.includes(profile.subscription_status);

    if (!hasAccess && !hasRefreshed.current) {
      hasRefreshed.current = true;
      setRefreshing(true);
      refreshProfile().finally(() => setRefreshing(false));
      return;
    }

    // Apres refresh, toujours pas autorise → page de gestion abonnement
    if (!hasAccess) {
      navigate("/subscription-required", { replace: true });
      return;
    }
  }, [user, profile, isLoading, refreshing, navigate, refreshProfile]);

  // Chargement en cours
  if (isLoading || refreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Bloquer si pas d'acces
  if (!user || !profile) return null;
  if (!ALLOWED_STATUSES.includes(profile.subscription_status)) return null;

  return <>{children}</>;
}
