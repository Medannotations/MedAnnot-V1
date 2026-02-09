import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  CreditCard,
  Calendar,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Loader2,
  Shield,
  Clock
} from "lucide-react";
import { format, parseISO, isValid, isAfter, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { subscription as subscriptionApi } from "@/services/api";
import { CancellationDialog } from "./CancellationDialogSimple";

interface StripeSubscriptionData {
  status: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

export function SubscriptionSettings() {
  const { profile, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isCancelledPending, setIsCancelledPending] = useState(false);
  
  // Données fraîches de Stripe
  const [stripeData, setStripeData] = useState<StripeSubscriptionData | null>(null);
  const [isFetchingStripe, setIsFetchingStripe] = useState(true);

  // Récupérer les données fraîches de Stripe via notre API
  useEffect(() => {
    const fetchStripeSubscription = async () => {
      if (!user?.id) {
        setIsFetchingStripe(false);
        return;
      }
      
      try {
        const data = await subscriptionApi.get();
        
        if (data.hasSubscription && data.subscription) {
          setStripeData({
            status: data.subscription.status,
            currentPeriodEnd: data.subscription.currentPeriodEnd,
            cancelAtPeriodEnd: data.subscription.cancelAtPeriodEnd,
          });
          setLocalStatus(data.subscription.status);
        }
      } catch (error) {
        console.error("Error fetching Stripe subscription:", error);
      } finally {
        setIsFetchingStripe(false);
      }
    };

    fetchStripeSubscription();
  }, [user?.id]);

  // Utiliser le statut frais ou celui du profil
  const subscriptionStatus = localStatus || profile?.subscription_status || "none";
  const isActive = subscriptionStatus === "active" || subscriptionStatus === "canceled";
  const isTrialing = subscriptionStatus === "trialing";
  const isCanceled = subscriptionStatus === "canceled";
  const isPastDue = subscriptionStatus === "past_due";

  // Utiliser la date fraîche de Stripe si disponible, sinon fallback sur Supabase
  const periodEnd = (() => {
    // Priorité 1: Données fraîches de Stripe
    if (stripeData?.currentPeriodEnd) {
      return new Date(stripeData.currentPeriodEnd * 1000);
    }
    
    // Priorité 2: Base Supabase (webhook)
    if (profile?.subscription_current_period_end) {
      const parsed = parseISO(profile.subscription_current_period_end);
      if (isValid(parsed)) return parsed;
    }
    
    // Fallback: +30 jours si actif/essai
    if (isTrialing || isActive) {
      return addDays(new Date(), 30);
    }
    
    return null;
  })();

  // Statut annulé depuis Stripe (plus fiable que Supabase)
  const isCanceledFromStripe = stripeData?.status === "canceled" || 
                                stripeData?.cancelAtPeriodEnd || 
                                isCanceled;

  const handleManagePayment = async () => {
    setIsLoading(true);
    try {
      const url = await subscriptionApi.createPortal();
      window.location.href = url;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'accéder au portail de gestion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    window.location.href = "/signup";
  };

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <Check className="w-3 h-3 mr-1" />
          Actif
        </Badge>
      );
    }
    if (isTrialing) {
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <Clock className="w-3 h-3 mr-1" />
          Essai gratuit
        </Badge>
      );
    }
    if (isCanceled) {
      return (
        <Badge variant="secondary">
          <X className="w-3 h-3 mr-1" />
          Résilié
        </Badge>
      );
    }
    if (isPastDue) {
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Paiement en retard
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        Aucun abonnement
      </Badge>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <CreditCard className="w-5 h-5" />
                Mon abonnement
              </CardTitle>
              <CardDescription className="text-sm">
                149 CHF/mois — Sans engagement
              </CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(isActive || isTrialing) && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm sm:text-base">Prochaine échéance</span>
              </div>
              <span className="font-medium text-sm sm:text-base">
                {periodEnd
                  ? format(periodEnd, "d MMMM yyyy", { locale: fr })
                  : "Non définie"
                }
              </span>
            </div>
          )}

          {(isCanceledFromStripe || isCancelledPending) && periodEnd && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <span className="font-medium">Résiliation programmée.</span>
                <br />
                Votre abonnement reste actif jusqu'au {format(periodEnd, "d MMMM yyyy", { locale: fr })}.
              </p>
            </div>
          )}

          {isPastDue && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <span className="font-medium">Problème de paiement détecté.</span>
                <br />
                Veuillez mettre à jour vos informations de paiement pour éviter l'interruption du service.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:gap-3">
          {/* Bouton Gérer l'abonnement - toujours visible si abonnement existe */}
          {(isActive || isTrialing || isPastDue || isCanceled) && (
            <Button
              onClick={handleManagePayment}
              disabled={isLoading}
              className="w-full"
              variant="outline"
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              Gérer sur Stripe
            </Button>
          )}
          
          {/* Bouton Résilier - visible si actif */}
          {(isActive || isTrialing || isPastDue) && !isCancelledPending && (
            <Button
              variant="ghost"
              onClick={() => setCancelDialogOpen(true)}
              className="w-full text-muted-foreground hover:text-red-600"
              size="sm"
            >
              Résilier
            </Button>
          )}

          {/* Bouton Réactiver - visible si annulé mais période active */}
          {isCanceledFromStripe && periodEnd && isAfter(periodEnd, new Date()) && (
            <Button
              onClick={handleManagePayment}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600"
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Réactiver
            </Button>
          )}

          {/* Bouton S'abonner - visible si aucun abonnement */}
          {!isActive && !isTrialing && !isCanceled && !isPastDue && (
            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600"
              size="sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              S'abonner
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base sm:text-lg">Inclus dans votre abonnement</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "Dictée vocale IA — 2h de gagnées chaque jour",
              "Annotations médicales complètes — plus de saisie manuelle",
              "Patients illimités — tout votre cabinet, un seul outil",
              "Templates personnalisables",
              "Support prioritaire",
              "Mises à jour automatiques",
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sécurité & Confidentialité
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Vos données de paiement sont sécurisées par Stripe. MedAnnot ne stocke jamais vos informations bancaires.
          </p>
          <p>
            Vous pouvez résilier votre abonnement à tout moment directement depuis cette page. Aucun frais de résiliation.
          </p>
        </CardContent>
      </Card>

      <CancellationDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        periodEnd={periodEnd}
        onCancelled={() => {
          setIsCancelledPending(true);
          setCancelDialogOpen(false);
        }}
      />
    </div>
  );
}
