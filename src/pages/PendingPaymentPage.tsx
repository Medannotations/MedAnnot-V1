import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CreditCard, ArrowRight, Loader2, XCircle, Clock, RefreshCw } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getToken, subscription } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const STATUS_CONFIG: Record<string, {
  icon: typeof AlertCircle;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  explanation: string;
  actionLabel: string;
  actionType: "checkout" | "portal";
}> = {
  pending_payment: {
    icon: Clock,
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/20",
    title: "Finalisez votre inscription",
    description: "Votre compte a ete cree, mais le paiement n'a pas ete finalise.",
    explanation: "Votre processus d'inscription a ete interrompu avant la confirmation du paiement. Pour acceder a MedAnnot, completez le paiement.",
    actionLabel: "Completer mon paiement",
    actionType: "checkout",
  },
  past_due: {
    icon: AlertCircle,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/20",
    title: "Paiement echoue",
    description: "Votre dernier paiement n'a pas pu etre traite.",
    explanation: "Votre carte bancaire a ete refusee ou a expire. Mettez a jour vos informations de paiement pour retrouver l'acces a votre compte. Toutes vos donnees (patients, annotations) sont conservees.",
    actionLabel: "Mettre a jour mon paiement",
    actionType: "portal",
  },
  canceled: {
    icon: XCircle,
    iconColor: "text-gray-400",
    iconBg: "bg-gray-500/20",
    title: "Abonnement resilie",
    description: "Votre abonnement MedAnnot a ete resilie.",
    explanation: "Vous pouvez vous reabonner a tout moment. Toutes vos donnees (patients, annotations, configuration) sont conservees et seront restaurees des la reactivation.",
    actionLabel: "Se reabonner",
    actionType: "portal",
  },
  unpaid: {
    icon: AlertCircle,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/20",
    title: "Paiement impaye",
    description: "Plusieurs tentatives de paiement ont echoue.",
    explanation: "Votre abonnement est suspendu suite a des echecs de paiement repetes. Mettez a jour vos informations bancaires pour reactiver votre compte. Vos donnees sont conservees.",
    actionLabel: "Regulariser mon paiement",
    actionType: "portal",
  },
  incomplete: {
    icon: Clock,
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/20",
    title: "Paiement en attente",
    description: "Votre premier paiement n'a pas ete confirme.",
    explanation: "Le paiement initial n'a pas abouti. Veuillez reessayer avec une autre carte ou methode de paiement.",
    actionLabel: "Reessayer le paiement",
    actionType: "portal",
  },
};

const DEFAULT_CONFIG = STATUS_CONFIG.pending_payment;

export function PendingPaymentPage() {
  const navigate = useNavigate();
  const { user, profile, logout, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const status = profile?.subscription_status || "pending_payment";
  const config = STATUS_CONFIG[status] || DEFAULT_CONFIG;
  const Icon = config.icon;

  useEffect(() => {
    document.title = "Abonnement requis | MedAnnot";

    // Si l'utilisateur a un statut autorise, rediriger vers l'app
    if (profile && (profile.subscription_status === 'trialing' || profile.subscription_status === 'active')) {
      navigate('/app');
    }
  }, [profile, navigate]);

  // Rafraichir le profil au chargement (peut-etre que le statut a change)
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const handleAction = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      if (config.actionType === "portal") {
        // Ouvrir le portail Stripe pour gerer l'abonnement
        const url = await subscription.createPortal();
        window.location.href = url;
      } else {
        // Creer une nouvelle session de checkout
        const token = getToken();
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || '/api'}/stripe-checkout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              priceId: import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY,
              userId: user.id,
              email: user.email,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erreur lors de la creation de la session de paiement");
        }

        const data = await response.json();

        if (!data.url) {
          throw new Error("Impossible de creer la session de paiement. Veuillez reessayer.");
        }

        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900/70 to-teal-900/60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-teal-500/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/15 bg-slate-800/50 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Logo size="lg" />
          <Button
            variant="ghost"
            onClick={logout}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Deconnexion
          </Button>
        </div>
      </header>

      <main className="relative max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <Card className="bg-slate-800/50 backdrop-blur-sm border border-white/10">
          <CardContent className="p-8 text-center">
            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-20 h-20 ${config.iconBg} rounded-full mb-6`}>
              <Icon className={`w-10 h-10 ${config.iconColor}`} />
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {config.title}
            </h1>

            {/* Description */}
            <p className="text-white/70 text-lg mb-6">
              {config.description}
            </p>

            <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 mb-8 text-left">
              <p className="text-sm text-white/80">
                <strong className="text-white">Que se passe-t-il ?</strong>
                <br />
                {config.explanation}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button
                size="lg"
                onClick={handleAction}
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white text-lg font-bold rounded-xl shadow-lg shadow-cyan-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Redirection...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    {config.actionLabel}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {/* Bouton rafraichir pour verifier si le statut a change */}
              <Button
                variant="outline"
                onClick={async () => {
                  await refreshProfile();
                  toast({ title: "Profil actualise", description: "Votre statut a ete verifie." });
                }}
                className="w-full border-white/20 text-white/70 hover:text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Verifier mon statut
              </Button>

              <Button
                variant="ghost"
                onClick={logout}
                className="w-full text-white/60 hover:text-white hover:bg-white/10"
              >
                Me deconnecter
              </Button>
            </div>

            {/* Help */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-white/60">
                Besoin d'aide ?{" "}
                <a
                  href="mailto:contact@medannot.ch"
                  className="text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  Contactez-nous
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
