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
      const priceId = import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user!.id}`,
          },
          body: JSON.stringify({
            priceId,
            userId: user!.id,
            email: user!.email,
          }),
        }
      );

      const data = await response.json();

      if (data.url) {
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

  const features = [
    "Annotations illimitées",
    "Patients illimités",
    "Dictée vocale IA",
    "Suivi des signes vitaux",
    "Support prioritaire",
    "7 jours d'essai gratuit",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Commencez votre essai gratuit
          </h1>
          <p className="text-lg text-gray-600">
            149 CHF/mois — Sans engagement — 7 jours gratuits
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Formule unique</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold text-gray-900">149</span>
              <span className="text-gray-600 ml-2">CHF/mois</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 mt-8">
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
