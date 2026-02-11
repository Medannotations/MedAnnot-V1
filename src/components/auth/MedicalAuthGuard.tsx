/**
 * Medical Auth Guard - Version sans Supabase
 * Utilise AuthContext maison avec JWT
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MedicalAuthGuardProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

export function MedicalAuthGuard({ children, requireSubscription = true }: MedicalAuthGuardProps) {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Si token existe dans localStorage mais pas encore dans AuthContext, attendre
    const hasToken = localStorage.getItem('medannot_token');
    if (hasToken && authLoading) {
      return; // AuthContext est en train de charger le token
    }

    if (authLoading) return;

    if (!user) {
      navigate('/');
      return;
    }

    if (!requireSubscription) {
      setIsChecking(false);
      return;
    }

    // Verifier le statut d'abonnement depuis le profil (deja charge par AuthContext)
    const status = profile?.subscription_status;

    if (status === 'active' || status === 'trialing') {
      setIsChecking(false);
      return;
    }

    // Verifier la date de fin de periode
    if (profile?.subscription_current_period_end) {
      const endDate = new Date(profile.subscription_current_period_end);
      if (endDate > new Date()) {
        setIsChecking(false);
        return;
      }
    }

    // Si pending_payment, rediriger vers page d'attente paiement
    if (status === 'pending_payment') {
      navigate('/signup');
      return;
    }

    // Autres statuts inactifs - rediriger vers pricing
    navigate('/pricing');
    setIsChecking(false);
  }, [user, profile, authLoading, navigate, requireSubscription]);

  if (authLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              Chargement...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-gray-600">
              Verification de votre acces...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export default MedicalAuthGuard;
