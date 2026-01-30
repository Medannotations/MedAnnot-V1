import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check, ArrowLeft, Eye, EyeOff, Stethoscope, Shield, Clock, XCircle } from "lucide-react";
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
      id: "monthly" as const,
      name: "Mensuel",
      price: "149",
      period: "/mois",
      description: "Flexibilité maximale",
      features: [
        "Annotations illimitées",
        "Patients illimités",
        "7 jours d'essai gratuit",
        "Annulation à tout moment",
      ],
    },
    {
      id: "yearly" as const,
      name: "Annuel",
      price: "125",
      period: "/mois",
      annualTotal: "1'499 CHF/an",
      badge: "Économisez 16%",
      recommended: true,
      features: [
        "Tout du plan mensuel",
        "7 jours d'essai gratuit",
        "Meilleur rapport qualité-prix",
        "Support prioritaire",
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
      // 1. Créer le compte utilisateur
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

      // 3. Créer la session Stripe Checkout
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
        toast({
          title: "Compte créé !",
          description: "Redirection vers le paiement sécurisé...",
        });

        setTimeout(() => {
          window.location.href = data.url;
        }, 500);
      } else {
        throw new Error("Impossible de créer la session de paiement");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              MedAnnot
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2 text-gray-600 hover:text-gray-900 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour</span>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* Title Section */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Commencez votre essai gratuit de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              7 jours
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-4">
            Créez votre compte et récupérez 2h par jour
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
            <Check className="w-4 h-4" />
            0 CHF prélevé pendant 7 jours
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Plan Selection */}
          <div className="animate-fade-in-up animation-delay-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Choisissez votre plan
            </h2>

            <div className="space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative cursor-pointer transition-all duration-300 rounded-2xl p-1 ${
                    selectedPlan === plan.id
                      ? "bg-gradient-to-r from-blue-600 to-emerald-500"
                      : "bg-transparent"
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                        RECOMMANDÉ
                      </span>
                    </div>
                  )}
                  {plan.badge && (
                    <div className="absolute -top-3 right-4 z-10">
                      <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  
                  <Card className={`relative transition-all duration-300 ${
                    selectedPlan === plan.id
                      ? "bg-white shadow-xl"
                      : "bg-white hover:shadow-lg border-gray-200"
                  }`}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                          
                          <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                              {plan.price}
                            </span>
                            <span className="text-gray-600 font-medium">CHF</span>
                            <span className="text-gray-500">{plan.period}</span>
                          </div>
                          
                          {plan.annualTotal && (
                            <p className="text-sm text-gray-500 mt-1">
                              Facturé {plan.annualTotal}
                            </p>
                          )}

                          <ul className="mt-4 space-y-2">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selectedPlan === plan.id
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-gray-300"
                        }`}>
                          {selectedPlan === plan.id && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Signup Form */}
          <div className="animate-fade-in-up animation-delay-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Créez votre compte
            </h2>

            <Card className="shadow-xl border-0">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Nom complet
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Dr. Marie Dupont"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email professionnel
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="marie@cabinet-medical.ch"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Mot de passe
                    </Label>
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
                        className="h-12 pr-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 touch-manipulation"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      disabled={isLoading}
                      className="mt-1 border-gray-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                      J'accepte les{" "}
                      <a href="/cgv" className="text-blue-600 hover:underline">
                        conditions générales
                      </a>{" "}
                      et la{" "}
                      <a href="/confidentialite" className="text-blue-600 hover:underline">
                        politique de confidentialité
                      </a>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-lg font-bold rounded-xl shadow-lg animate-pulse-glow touch-manipulation"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Création en cours...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🚀</span>
                        Démarrer mon essai gratuit
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-gray-500">
                    Déjà un compte ?{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline font-medium touch-manipulation"
                      onClick={() => navigate("/?login=true")}
                      disabled={isLoading}
                    >
                      Se connecter
                    </button>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 sm:mt-16 animate-fade-in-up animation-delay-300">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium">7 jours gratuits</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Conforme LPD</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium">Annulation en 1 clic</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
