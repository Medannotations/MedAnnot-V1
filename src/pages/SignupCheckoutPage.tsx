import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function SignupCheckoutPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

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
      popular: true,
      features: [
        "Tout du plan mensuel",
        "Paiement annuel",
        "7 jours d'essai gratuit",
        "-45% par rapport au mensuel",
      ],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast({
        title: "Erreur",
        description: "Veuillez accepter les conditions d'utilisation.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Créer le compte utilisateur (sans vérification email)
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signupError) throw signupError;
      if (!authData.user) throw new Error("Erreur lors de la création du compte");

      // 2. Se connecter immédiatement
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // 3. Le profil sera créé automatiquement par le webhook Stripe après paiement

      // 4. Créer la session Stripe Checkout
      const priceId = selectedPlan === "monthly"
        ? import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY
        : import.meta.env.VITE_STRIPE_PRICE_ID_YEARLY;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId,
            userId: authData.user.id,
            email: email,
          }),
        }
      );

      const data = await response.json();

      if (data.url) {
        // 5. Rediriger vers Stripe Checkout
        toast({
          title: "Compte créé !",
          description: "Redirection vers le paiement sécurisé...",
        });

        // Attendre un peu pour que l'utilisateur voie le message
        setTimeout(() => {
          window.location.href = data.url;
        }, 500);
      } else {
        throw new Error("Impossible de créer la session de paiement");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Commencez votre essai gratuit
          </h1>
          <p className="text-lg text-gray-600">
            Créez votre compte et choisissez votre plan - 7 jours gratuits
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left: Plan Selection */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Choisissez votre plan</h2>

            <div className="space-y-4">
              {plans.map((plan) => (
                <Card
                  key={plan.priceId}
                  className={`relative cursor-pointer transition-all ${
                    selectedPlan === plan.priceId
                      ? "ring-2 ring-blue-500 shadow-xl bg-blue-50"
                      : "hover:shadow-lg"
                  }`}
                  onClick={() => setSelectedPlan(plan.priceId as "monthly" | "yearly")}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Plus populaire
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription className="mt-2">
                          <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                          <span className="text-gray-600 ml-2">CHF {plan.period}</span>
                        </CardDescription>
                        {plan.savings && (
                          <p className="text-green-600 font-semibold mt-2 text-sm">
                            {plan.savings}
                          </p>
                        )}
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === plan.priceId
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300"
                      }`}>
                        {selectedPlan === plan.priceId && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right: Signup Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Créez votre compte</h2>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Marie Dupont"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email professionnel</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.ch"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 6 caractères"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={6}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
                      J'accepte les conditions générales et la politique de confidentialité
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Création du compte...
                      </>
                    ) : (
                      "Commencer mon essai gratuit"
                    )}
                  </Button>

                  <p className="text-center text-sm text-gray-500 pt-2">
                    Déjà un compte ?{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() => navigate("/?login=true")}
                      disabled={isLoading}
                    >
                      Se connecter
                    </button>
                  </p>
                </form>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Pas de carte bancaire requise pour l'essai</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Annulation possible à tout moment</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
