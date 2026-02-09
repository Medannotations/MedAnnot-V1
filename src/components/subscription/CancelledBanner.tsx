import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Sparkles, AlertCircle, RotateCcw, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { format, parseISO, isValid, isAfter } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function CancelledBanner() {
  const { profile, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Vérifier si on revient du portail Stripe
  const isReturningFromPortal = searchParams.get("portal") === "return";
  
  // Nettoyer l'URL après détection
  useEffect(() => {
    if (isReturningFromPortal) {
      // Enlever le paramètre de l'URL sans recharger
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("portal");
      setSearchParams(newParams, { replace: true });
    }
  }, [isReturningFromPortal, searchParams, setSearchParams]);
  
  // Récupérer le statut depuis sessionStorage
  const storageKey = `cancelled-banner-closed-${user?.id}`;
  
  useEffect(() => {
    const wasClosed = sessionStorage.getItem(storageKey);
    if (wasClosed && !isReturningFromPortal) {
      setIsVisible(false);
    }
  }, [storageKey, isReturningFromPortal]);

  // Vérifier si résilié
  const isCanceled = profile?.subscription_status === "canceled";
  
  // Parser la date de fin
  const periodEnd = (() => {
    if (!profile?.subscription_current_period_end) return null;
    const parsed = parseISO(profile.subscription_current_period_end);
    return isValid(parsed) ? parsed : null;
  })();
  
  // Afficher SI:
  // 1. On revient du portail (pour permettre de réactiver)
  // 2. OU si résilié avec période active
  const shouldShow = (isReturningFromPortal) || (isCanceled && periodEnd && isAfter(periodEnd, new Date()));
  
  if (!shouldShow || !isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem(storageKey, "true");
  };

  const handleOpenStripe = async () => {
    setIsLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-portal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ 
            returnUrl: `${window.location.origin}/app/settings?portal=return`
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'ouverture du portail");
      }

      const data = await response.json();

      if (data.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le portail de gestion",
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
                {isReturningFromPortal && !isCanceled 
                  ? "Gérez votre abonnement sur Stripe" 
                  : "Votre abonnement se termine bientôt"}
              </p>
              <p className="text-amber-700 text-xs sm:text-sm">
                {isCanceled && periodEnd ? (
                  <>
                    Plus que <strong>{daysLeft} jour{daysLeft > 1 ? 's' : ''}</strong> jusqu'au{" "}
                    <strong>{format(periodEnd, "d MMMM", { locale: fr })}</strong>. 
                    Réactivez maintenant pour ne pas perdre l'accès.
                  </>
                ) : isReturningFromPortal ? (
                  "Vous pouvez annuler ou modifier votre abonnement depuis le portail Stripe."
                ) : (
                  "Votre accès expire bientôt. Réactivez maintenant !"
                )}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={handleOpenStripe}
              disabled={isLoading}
              size="sm"
              className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md"
            >
              {isLoading ? (
                <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2 sm:hidden" />
                  <Sparkles className="w-4 h-4 mr-2 hidden sm:inline" />
                </>
              )}
              <span className="hidden sm:inline">
                {isReturningFromPortal && !isCanceled ? "Gérer sur Stripe" : "Réactiver mon abonnement"}
              </span>
              <span className="sm:hidden">
                {isReturningFromPortal && !isCanceled ? "Gérer" : "Réactiver"}
              </span>
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
