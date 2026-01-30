// MEDICAL-GRADE AUTHENTICATION SYSTEM
// Fixes UI access failures, ensures proper subscription flow

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface MedicalAuthGuardProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

export function MedicalAuthGuard({ children, requireSubscription = true }: MedicalAuthGuardProps) {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 10; // 5 minutes max polling

  // Medical-grade authentication check
  useEffect(() => {
    if (authLoading) return;

    const checkMedicalAccess = async () => {
      try {
        console.log('🏥 MEDICAL AUTH CHECK: Starting authentication verification');

        if (!user) {
          console.log('🏥 MEDICAL AUTH CHECK: No user, redirecting to login');
          navigate('/login');
          return;
        }

        if (!requireSubscription) {
          console.log('🏥 MEDICAL AUTH CHECK: Subscription not required, access granted');
          setIsChecking(false);
          return;
        }

        // Force refresh user profile for latest subscription status
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          console.log('🏥 MEDICAL AUTH CHECK: No valid session');
          navigate('/login');
          return;
        }

        // Get fresh profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('subscription_status, subscription_end_date, created_at')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('🏥 MEDICAL AUTH CHECK: Profile fetch failed:', profileError);
          throw new Error('Impossible de vérifier votre profil');
        }

        console.log('🏥 MEDICAL AUTH CHECK: Profile data:', profileData);
        setSubscriptionStatus(profileData?.subscription_status);

        // Check subscription status
        if (profileData?.subscription_status === 'active') {
          console.log('🏥 MEDICAL AUTH CHECK: Active subscription, access granted');
          setIsChecking(false);
          return;
        }

        if (profileData?.subscription_status === 'trialing') {
          console.log('🏥 MEDICAL AUTH CHECK: Trial active, access granted');
          setIsChecking(false);
          return;
        }

        // Handle trial expiration
        if (profileData?.subscription_end_date) {
          const endDate = new Date(profileData.subscription_end_date);
          const now = new Date();
          
          if (endDate > now) {
            console.log('🏥 MEDICAL AUTH CHECK: Trial still valid by date, access granted');
            setIsChecking(false);
            return;
          }
        }

        // Handle inactive subscription
        console.log('🏥 MEDICAL AUTH CHECK: No active subscription, redirecting to pricing');
        navigate('/pricing?reason=subscription_required');

      } catch (error) {
        console.error('🏥 MEDICAL AUTH CHECK: Error during verification:', error);
        toast({
          title: "Erreur d'authentification",
          description: "Impossible de vérifier votre accès. Veuillez réessayer.",
          variant: "destructive",
        });
        
        // Retry logic for transient failures
        if (retryCount < MAX_RETRIES) {
          console.log(`🏥 MEDICAL AUTH CHECK: Retrying in 30 seconds (attempt ${retryCount + 1}/${MAX_RETRIES})`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            checkMedicalAccess();
          }, 30000); // 30 second retry
        } else {
          console.log('🏥 MEDICAL AUTH CHECK: Max retries reached, showing error');
          setIsChecking(false);
          toast({
            title: "Erreur de connexion",
            description: "Impossible de vérifier votre abonnement. Contactez le support.",
            variant: "destructive",
          });
        }
      }
    };

    checkMedicalAccess();
  }, [user, profile, authLoading, navigate, requireSubscription, retryCount]);

  // Medical loading state
  if (authLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              Vérification médicale
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-gray-600">
              Vérification de votre accès aux données médicales...
            </div>
            <div className="text-sm text-gray-500">
              {retryCount > 0 && `Tentative ${retryCount}/${MAX_RETRIES}`}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: `${(retryCount / MAX_RETRIES) * 100}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Medical access granted
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}

// Export for use in routing
export default MedicalAuthGuard;