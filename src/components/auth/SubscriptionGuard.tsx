import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function SubscriptionGuard({ children }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Poll for subscription status updates
  useEffect(() => {
    if (!user || profile?.subscription_status === 'active') return;
    
    const pollSubscription = async () => {
      if (retryCount >= 10) { // Max 5 minutes of polling
        setIsChecking(false);
        return;
      }

      // Force refresh profile data
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (data?.subscription_status === 'active') {
          setIsChecking(false);
          return;
        }
      }
      
      setRetryCount(prev => prev + 1);
    };

    const interval = setInterval(pollSubscription, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [user, profile, retryCount]);

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

    // Pas de profil encore chargé → on attend max 10 secondes puis on autorise
    if (!profile) {
      // Timer pour éviter le chargement infini
      const timer = setTimeout(() => {
        setIsChecking(false);
      }, 10000);

      return () => clearTimeout(timer);
    }

    // Utilisateur a un abonnement actif → accès autorisé
    if (profile.subscription_status === "active") {
      setIsChecking(false);
      return;
    }

    // NOUVEAU: Utilisateur avec compte récent (moins de 15 minutes) → accès autorisé
    // Cela permet aux nouveaux utilisateurs d'accéder à l'app pendant que Stripe traite le webhook
    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / 1000 / 60;

    if (minutesSinceCreation < 15) {
      setIsChecking(false);
      return;
    }

    // Utilisateur vient juste de payer → donner 10 minutes pour que le webhook Stripe traite
    // On vérifie si le compte a été créé récemment (moins de 10 minutes)
    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / 1000 / 60;

    if (minutesSinceCreation < 10) {
      // Compte récent, probablement en train de s'inscrire
      // On autorise temporairement l'accès pour que le webhook ait le temps de traiter
      setIsChecking(false);
      return;
    }

    // Vérifier si nous venons d'une page de succès (paramètre URL)
    const urlParams = new URLSearchParams(window.location.search);
    const fromSuccess = urlParams.get('from') === 'success';
    const minutesSinceSuccess = sessionStorage.getItem('successTimestamp');
    
    if (fromSuccess && minutesSinceSuccess) {
      const successTime = new Date(parseInt(minutesSinceSuccess));
      const now = new Date();
      const minutesSinceSuccessCalc = (now.getTime() - successTime.getTime()) / 1000 / 60;
      
      if (minutesSinceSuccessCalc < 15) {
        // Recent success page - allow access while webhook processes
        setIsChecking(false);
        return;
      }
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
