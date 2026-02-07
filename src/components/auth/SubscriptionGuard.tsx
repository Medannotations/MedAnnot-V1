import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function SubscriptionGuard({ children }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkCount, setCheckCount] = useState(0);

  // Safety timeout - force render after 10 seconds max
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (isChecking) {
        console.log("Safety timeout triggered - forcing access");
        setIsChecking(false);
      }
    }, 10000);
    
    return () => clearTimeout(safetyTimer);
  }, [isChecking]);

  // Main subscription check logic
  useEffect(() => {
    if (isLoading) return;

    // Not logged in → redirect to landing
    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    // No profile loaded yet → allow access with grace period
    if (!profile) {
      console.log("No profile yet, waiting...");
      // If no profile after 3 seconds, still allow access (grace period for new users)
      const timer = setTimeout(() => {
        console.log("Grace period ended - allowing access without profile");
        setIsChecking(false);
      }, 3000);
      return () => clearTimeout(timer);
    }

    console.log("Checking subscription for profile:", profile);

    // Active subscription → immediate access
    if (profile.subscription_status === "active") {
      console.log("Active subscription - access granted");
      setIsChecking(false);
      return;
    }

    // Check creation date for grace period
    let minutesSinceCreation = 0;
    try {
      const createdAt = new Date(profile.created_at);
      const now = new Date();
      minutesSinceCreation = (now.getTime() - createdAt.getTime()) / 1000 / 60;
    } catch (e) {
      console.error("Error parsing created_at:", e);
      // If we can't parse the date, assume it's a new user
      minutesSinceCreation = 0;
    }

    console.log("Minutes since creation:", minutesSinceCreation);

    // 30-minute grace period for new users
    if (minutesSinceCreation < 30) {
      console.log("Within grace period - access granted");
      setIsChecking(false);
      return;
    }

    // Check for recent successful payment
    const checkPaymentStatus = async () => {
      try {
        setCheckCount(prev => prev + 1);
        
        const { data: payments, error: paymentsError } = await supabase
          .from('stripe_payments')
          .select('status, created_at')
          .eq('user_id', user.id)
          .eq('status', 'succeeded')
          .order('created_at', { ascending: false })
          .limit(1);

        if (paymentsError) {
          console.error("Error checking payments:", paymentsError);
          // Don't block on error - allow access and retry
          setIsChecking(false);
          return;
        }

        if (payments?.length > 0) {
          const paymentCreated = new Date(payments[0].created_at);
          const now = new Date();
          const minutesSincePayment = (now.getTime() - paymentCreated.getTime()) / 1000 / 60;
          
          if (minutesSincePayment < 60) {
            console.log("Recent payment found - access granted");
            setIsChecking(false);
            return;
          }
        }
        
        // No valid subscription → redirect to checkout
        console.log("No valid subscription - redirecting to checkout");
        navigate("/checkout", { replace: true });
      } catch (error) {
        console.error("Error in checkPaymentStatus:", error);
        setError("Une erreur est survenue lors de la vérification de votre abonnement");
        setIsChecking(false);
      }
    };

    checkPaymentStatus();
  }, [user, profile, navigate, isLoading]);

  // Show loading state
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Vérification de votre accès...</p>
          <p className="text-gray-400 text-sm mt-2">Cela ne prend que quelques secondes</p>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Problème de connexion</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Réessayer
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}