import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CreditCard, ArrowRight, Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "@/services/api";
import { toast } from "@/hooks/use-toast";

export function PendingPaymentPage() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Paiement en attente | MedAnnot";

    // Si l'utilisateur n'est pas en pending_payment, rediriger
    if (profile && profile.subscription_status !== 'pending_payment') {
      navigate('/app');
    }
  }, [profile, navigate]);

  const handleCompletePayment = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
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
        throw new Error(errorData.error || "Erreur lors de la création de la session de paiement");
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("Impossible de créer la session de paiement. Veuillez réessayer.");
      }

      window.location.href = data.url;
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
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="relative max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <Card className="bg-slate-800/50 backdrop-blur-sm border border-white/10">
          <CardContent className="p-8 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500/20 rounded-full mb-6">
              <AlertCircle className="w-10 h-10 text-orange-400" />
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Paiement en attente de confirmation
            </h1>

            {/* Description */}
            <p className="text-white/70 text-lg mb-6">
              Votre compte a été créé, mais votre paiement n'a pas été confirmé.
            </p>

            <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 mb-8 text-left">
              <p className="text-sm text-white/80">
                <strong className="text-white">Que s'est-il passé ?</strong>
                <br />
                Votre processus d'inscription a été interrompu avant la confirmation du paiement sur Stripe.
                Pour accéder à MedAnnot, vous devez compléter le processus de paiement.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button
                size="lg"
                onClick={handleCompletePayment}
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
                    Compléter mon paiement
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={logout}
                className="w-full text-white/60 hover:text-white hover:bg-white/10"
              >
                Me déconnecter
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
