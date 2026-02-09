import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format, parseISO, isValid, isAfter } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function CancelledBanner() {
  const { profile, user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Récupérer le statut depuis localStorage (pour savoir si l'user a fermé)
  const storageKey = `cancelled-banner-closed-${user?.id}`;
  
  useEffect(() => {
    const wasClosed = sessionStorage.getItem(storageKey);
    if (wasClosed) {
      setIsVisible(false);
    }
  }, [storageKey]);

  // Vérifier si on doit afficher la bannière
  const isCanceled = profile?.subscription_status === "canceled";
  
  const periodEnd = (() => {
    if (!profile?.subscription_current_period_end) return null;
    const parsed = parseISO(profile.subscription_current_period_end);
    return isValid(parsed) ? parsed : null;
  })();
  
  // Afficher uniquement si résilié ET période encore active
  const shouldShow = isCanceled && periodEnd && isAfter(periodEnd, new Date());
  
  if (!shouldShow || !isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem(storageKey, "true");
  };

  const handleReactivate = async () => {
    setIsLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      // Appeler la fonction pour réactiver
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-reactivate-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        // Si la fonction n'existe pas, rediriger vers le portail Stripe
        const { data: portalData } = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-portal`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
              "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ userId: user?.id }),
          }
        ).then(r => r.ok ? r.json() : Promise.reject());

        if (portalData?.url) {
          window.location.href = portalData.url;
          return;
        }
        
        throw new Error("Impossible de réactiver");
      }

      toast({
        title: "Abonnement réactivé !",
        description: "Votre abonnement est à nouveau actif.",
      });
      
      // Recharger la page pour mettre à jour le statut
      window.location.reload();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de réactiver. Contactez le support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const daysLeft = periodEnd ? Math.ceil((periodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="sticky top-14 z-30 w-full bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Contenu */}
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-amber-900 text-sm sm:text-base">
                Votre abonnement se termine bientôt
              </p>
              <p className="text-amber-700 text-xs sm:text-sm">
                {daysLeft > 0 ? (
                  <>
                    Plus que <strong>{daysLeft} jour{daysLeft > 1 ? 's' : ''}</strong> jusqu'au{" "}
                    <strong>{format(periodEnd, "d MMMM", { locale: fr })}</strong>. 
                    Réactivez maintenant pour ne pas perdre l'accès.
                  </>
                ) : (
                  "Votre accès expire aujourd'hui. Réactivez maintenant !"
                )}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={handleReactivate}
              disabled={isLoading}
              size="sm"
              className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md"
            >
              {isLoading ? (
                <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              <span className="hidden sm:inline">Réactiver mon abonnement</span>
              <span className="sm:hidden">Réactiver</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-100 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
