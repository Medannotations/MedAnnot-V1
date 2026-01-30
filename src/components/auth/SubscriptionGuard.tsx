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
      if (retryCount >= 20) { // Max 10 minutes of polling
        setIsChecking(false);
        return;
      }

      try {
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
      } catch (error) {
        console.error('Error polling subscription:', error);
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

    // MEDICAL-GRADE FIX: Immediate access for new subscribers with active payment intent
    // Reduces conversion friction while maintaining security
    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / 1000 / 60;

    // Allow immediate access for first 10 minutes, then check for payment confirmation
    if (minutesSinceCreation < 10) {
      setIsChecking(false);
      return;
    }

    // Extended grace period for Stripe webhook processing (up to 30 minutes)
    if (minutesSinceCreation < 30 && !profile.subscription_status) {
      // Check for recent Stripe payment intent
      const checkRecentPayment = async () => {
        try {
          const { data: payments } = await supabase
            .from('stripe_payments')
            .select('status, created_at')
            .eq('user_id', user.id)
            .eq('status', 'succeeded')
            .order('created_at', { ascending: false })
            .limit(1);

          if (payments && payments.length > 0) {
            const paymentCreated = new Date(payments[0].created_at);
            const minutesSincePayment = (now.getTime() - paymentCreated.getTime()) / 1000 / 60;
            
            if (minutesSincePayment < 30) {
              setIsChecking(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error checking recent payment:', error);
        }
      };
      
      checkRecentPayment();
    }

    // Vérifier si nous venons d'une page de succès (paramètre URL)
    const urlParams = new URLSearchParams(window.location.search);
    const fromSuccess = urlParams.get('from') === 'success';
    const successTimestamp = sessionStorage.getItem('successTimestamp');
    
    if (fromSuccess && successTimestamp) {
      const successTime = new Date(parseInt(successTimestamp));
      const now = new Date();
      const minutesSinceSuccessCalc = (now.getTime() - successTime.getTime()) / 1000 / 60;
      
      if (minutesSinceSuccessCalc < 60) {
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