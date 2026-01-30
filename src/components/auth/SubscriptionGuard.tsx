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

  // SURGICAL CEO FIX: Simplified logic for zero-friction conversion
  useEffect(() => {
    if (isLoading) return;

    // Not logged in → redirect to landing
    if (!user) {
      navigate("/");
      return;
    }

    // No profile loaded yet → allow access with 5-second grace period
    if (!profile) {
      const timer = setTimeout(() => {
        setIsChecking(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    // Active subscription → immediate access
    if (profile.subscription_status === "active") {
      setIsChecking(false);
      return;
    }

    // CEO DOMINANCE: 30-minute grace period for new subscribers
    // This eliminates the #1 conversion killer while maintaining security
    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / 1000 / 60;

    if (minutesSinceCreation < 30) {
      setIsChecking(false);
      return;
    }

    // Check for recent successful payment
    const checkPaymentStatus = async () => {
      try {
        const { data: payments } = await supabase
          .from('stripe_payments')
          .select('status, created_at')
          .eq('user_id', user.id)
          .eq('status', 'succeeded')
          .order('created_at', { ascending: false })
          .limit(1);

        if (payments?.length > 0) {
          const paymentCreated = new Date(payments[0].created_at);
          const minutesSincePayment = (now.getTime() - paymentCreated.getTime()) / 1000 / 60;
          
          if (minutesSincePayment < 60) {
            setIsChecking(false);
            return;
          }
        }
      } catch (error) {
        console.error('Payment check failed:', error);
      }
      
      // No valid subscription → redirect to checkout
      navigate("/checkout");
    };

    checkPaymentStatus();
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