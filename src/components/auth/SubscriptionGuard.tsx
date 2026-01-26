import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function SubscriptionGuard({ children }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Still loading auth state, don't redirect yet
    if (isLoading) {
      return;
    }

    // Pas connecté → retour landing
    if (!user) {
      navigate("/");
      return;
    }

    // Pas de profil encore chargé → on attend max 3 secondes puis on autorise
    if (!profile) {
      // Timer pour éviter le chargement infini
      const timer = setTimeout(() => {
        setIsChecking(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    // Si subscription_status n'est pas défini (ancienne DB), on autorise l'accès
    if (!profile.subscription_status) {
      setIsChecking(false);
      return;
    }

    // Utilisateur a un abonnement actif → accès autorisé
    if (profile.subscription_status === "active") {
      setIsChecking(false);
      return;
    }

    // Utilisateur vient juste de payer → donner 2 minutes pour que le webhook Stripe traite
    // On vérifie si le compte a été créé récemment (moins de 5 minutes)
    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / 1000 / 60;

    if (minutesSinceCreation < 5) {
      // Compte récent, probablement en train de s'inscrire
      // On autorise temporairement l'accès pour que le webhook ait le temps de traiter
      setIsChecking(false);
      return;
    }

    // Sinon, pas d'abonnement → redirection checkout
    navigate("/checkout");
  }, [user, profile, navigate, isLoading]);

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
