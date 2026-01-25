import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check } from "lucide-react";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const priceId = selectedPlan === "monthly" 
        ? import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY
        : import.meta.env.VITE_STRIPE_PRICE_ID_YEARLY;

      // Appeler l'Edge Function pour créer la session Stripe
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.id}`,
          },
          body: JSON.stringify({
            priceId: priceId,
            userId: user.id,
            email: user.email,
          }),
        }
      );

      const data = await response.json();

      if (data.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("Impossible de créer la session de paiement");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du paiement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      name: "Mensuel",
      price: "189",
      period: "par mois",
      priceId: "monthly",
      features: [
        "Annotations illimitées",
        "Patients illimités",
        "Exportation PDF/Word",
        "Support prioritaire",
        "7 jours d'essai gratuit",
      ],
    },
    {
      name: "Annuel",
      price: "1499",
      period: "par an",
      priceId: "yearly",
      savings: "Économisez 769 CHF !",
      features: [
        "Tout du plan mensuel",
        "Paiement annuel",
        "7 jours d'essai gratuit",
        "-45% par rapport au mensuel",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-lg text-gray-600">
            Sélectionnez le plan qui vous convient le mieux et commencez votre essai gratuit
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.priceId}
              className={`relative cursor-pointer transition-all ${
                selectedPlan === plan.priceId
                  ? "ring-2 ring-blue-500 shadow-xl"
                  : "hover:shadow-lg"
              }`}
              onClick={() => setSelectedPlan(plan.priceId as "monthly" | "yearly")}
            >
              {plan.savings && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {plan.savings}
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">CHF {plan.period}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    selectedPlan === plan.priceId
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                  variant={selectedPlan === plan.priceId ? "default" : "outline"}
                >
                  Sélectionner
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            Retour
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Redirection vers le paiement...
              </>
            ) : (
              "Continuer vers le paiement"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
