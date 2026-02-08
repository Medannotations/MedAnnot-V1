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
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

export function SubscriptionSettings() {
  const { profile, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  // Récupérer le statut frais depuis la base
  useEffect(() => {
    const fetchFreshStatus = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from("profiles")
        .select("subscription_status, subscription_current_period_end")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setLocalStatus(data.subscription_status);
      }
    };
    fetchFreshStatus();
  }, [user?.id]);

  // Utiliser le statut frais ou celui du profil
  const subscriptionStatus = localStatus || profile?.subscription_status || "none";
  const isActive = subscriptionStatus === "active";
  const isTrialing = subscriptionStatus === "trialing";
  const isCanceled = subscriptionStatus === "canceled";
  const isPastDue = subscriptionStatus === "past_due";

  const periodEnd = profile?.subscription_current_period_end 
    ? parseISO(profile.subscription_current_period_end)
    : null;

  const handleManageSubscription = async () => {
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
          },
          body: JSON.stringify({ userId: user?.id }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Portal response error:", response.status, errorText);
        throw new Error(
          response.status === 404
            ? "La fonction stripe-portal n'est pas déployée. Déployez-la avec: supabase functions deploy stripe-portal"
            : `Erreur serveur (${response.status})`
        );
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Portal response without URL:", data);
        throw new Error(data.error || "Impossible d'accéder au portail de gestion");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'accéder à la gestion d'abonnement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    window.location.href = "/checkout?upgrade=true";
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Mon abonnement
              </CardTitle>
              <CardDescription>
                Gérez votre abonnement MedAnnot
              </CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(isActive || isTrialing) && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Prochaine échéance</span>
              </div>
              <span>
                {periodEnd
                  ? format(periodEnd, "d MMMM yyyy", { locale: fr })
                  : "Non définie"
                }
              </span>
            </div>
          )}

          {isCanceled && periodEnd && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <span className="font-medium">Votre abonnement est résilié.</span>
                <br />
                Vous avez accès jusqu'au {format(periodEnd, "d MMMM yyyy", { locale: fr })}.
                Réactivez pour ne pas perdre l'accès.
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
        <CardFooter className="flex flex-col gap-3">
          {(isActive || isTrialing || isPastDue) && (
            <Button 
              onClick={handleManageSubscription} 
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              Gérer mon abonnement
            </Button>
          )}
          
          {((!isActive && !isTrialing) || isCanceled) && (
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              S'abonner maintenant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {(isActive || isTrialing) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Changer de formule</CardTitle>
            <CardDescription>
              Passez à l'abonnement annuel et économisez
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-2 border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Mensuel</CardTitle>
                  <CardDescription>Flexibilité maximale</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">149 CHF<span className="text-sm font-normal text-muted-foreground">/mois</span></div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-emerald-500 bg-emerald-50/50 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-emerald-500 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    RECOMMANDÉ
                  </Badge>
                </div>
                <CardHeader className="pb-3 pt-6">
                  <CardTitle className="text-base">Annuel</CardTitle>
                  <CardDescription>Économisez 288 CHF/an</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">125 CHF<span className="text-sm font-normal text-muted-foreground">/mois</span></div>
                  <p className="text-xs text-muted-foreground mt-1">Engagement 12 mois, paiement mensuel</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleManageSubscription}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full border-emerald-500 text-emerald-700 hover:bg-emerald-100"
                  >
                    Passer à l'annuel
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Inclus dans votre abonnement</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "Annotations illimitées",
              "Patients illimités",
              "Dictée vocale IA",
              "Templates personnalisables",
              "Support prioritaire",
              "Mises à jour automatiques",
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-emerald-500" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sécurité & Confidentialité
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Vos données de paiement sont sécurisées par Stripe. MedAnnot ne stocke jamais vos informations bancaires.
          </p>
          <p>
            Vous pouvez résilier votre abonnement à tout moment depuis le portail de gestion. Aucun frais de résiliation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
