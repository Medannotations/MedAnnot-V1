import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check, ArrowLeft, Eye, EyeOff, Stethoscope, Shield, Clock, Sparkles, Lock, Mail, User, Calendar, CreditCard } from "lucide-react";
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

  const today = new Date();
  const trialEndDate = new Date(today);
  trialEndDate.setDate(today.getDate() + 7);
  const formattedTrialEnd = trialEndDate.toLocaleDateString('fr-CH', { 
    day: 'numeric', 
    month: 'long' 
  });

  const plans = [
    {
      id: "monthly" as const,
      name: "Mensuel",
      price: "149",
      period: "/mois",
      description: "Sans engagement",
      engagement: "Résiliable à tout moment",
      icon: Clock,
      features: [
        "Annotations illimitées",
        "Patients illimités",
        "Support par email",
      ],
    },
    {
      id: "yearly" as const,
      name: "Annuel",
      price: "125",
      period: "/mois",
      description: "Engagement 12 mois",
      engagement: "Économisez 288 CHF/an",
      icon: Shield,
      badge: "Le plus populaire",
      recommended: true,
      features: [
        "Tout du plan mensuel",
        "Support prioritaire",
        "Meilleur rapport qualité-prix",
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
        // If no Stripe URL, redirect to app anyway (user is logged in)
        console.log("No Stripe checkout URL, redirecting to app");
        toast({
          title: "Compte créé !",
          description: "Bienvenue sur MedAnnot. Vous pouvez commencer votre essai gratuit.",
        });
        navigate("/app");
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              MedAnnot
            </span>
          </button>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour</span>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* HERO: 0 CHF aujourd'hui - GROS et VISIBLE */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl mb-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                <div className="text-left">
                  <p className="text-3xl sm:text-4xl font-bold">0 CHF</p>
                  <p className="text-emerald-100 text-sm font-medium">aujourd'hui</p>
                </div>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Commencez votre essai gratuit
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Testez MedAnnot pendant 7 jours sans payer. <br className="hidden sm:block"/>
              Annulez avant le <strong>{formattedTrialEnd}</strong> et vous ne serez pas débité.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Plan Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Choisissez votre formule pour après l'essai
            </h2>
            <p className="text-sm text-gray-500 -mt-2 mb-4">
              Vous ne serez débité que si vous continuez après le {formattedTrialEnd}
            </p>

            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;
              
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/30 shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-4">
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        <Sparkles className="w-3 h-3" />
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-5 h-5 ${isSelected ? "text-emerald-600" : "text-gray-400"}`} />
                          <h3 className={`font-bold text-lg ${isSelected ? "text-emerald-900" : "text-gray-900"}`}>
                            {plan.name}
                          </h3>
                        </div>
                        
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className={`text-3xl font-bold ${isSelected ? "text-emerald-700" : "text-gray-900"}`}>
                            {plan.price}
                          </span>
                          <span className="text-gray-500 font-medium">CHF</span>
                          <span className="text-gray-400">{plan.period}</span>
                        </div>
                        
                        <p className={`text-sm ${isSelected ? "text-emerald-600 font-medium" : "text-gray-500"}`}>
                          {plan.engagement}
                        </p>

                        <ul className="mt-3 space-y-1">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-gray-300"
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Info box - PRÉLÈVEMENT EXPLICITE */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-900 font-medium">
                    Quand serez-vous débité ?
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    <strong>Aujourd'hui : 0 CHF</strong> (essai gratuit)<br/>
                    <strong>Le {formattedTrialEnd}</strong> : {selectedPlan === "monthly" ? "149 CHF" : "125 CHF"} si vous continuez<br/>
                    Ensuite : tous les mois à la même date
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Signup Form */}
          <div>
            <Card className="shadow-xl border-0 bg-white">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Créez votre compte
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium text-sm">
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
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
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
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
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
                        className="h-12 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      disabled={isLoading}
                      className="mt-1 border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                      J'accepte les{" "}
                      <a href="/terms-of-service" className="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                        CGV
                      </a>{" "}
                      et la{" "}
                      <a href="/privacy-policy" className="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                        confidentialité
                      </a>
                    </Label>
                  </div>

                  {/* CTA 0 CHF */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Création en cours...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Commencer gratuitement
                        </>
                      )}
                    </Button>
                    <p className="text-center text-xs text-gray-500 mt-2">
                      Carte bancaire requise mais <strong>aucun prélèvement aujourd'hui</strong>
                    </p>
                  </div>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Lock className="w-3 h-3" />
                      SSL sécurisé
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      7 jours gratuits
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Check className="w-3 h-3" />
                      Annulation facile
                    </div>
                  </div>

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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Garanties en bas */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">7 jours gratuits</h3>
            <p className="text-xs text-gray-500 mt-1">Testez sans risque</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Sans engagement</h3>
            <p className="text-xs text-gray-500 mt-1">Annulez quand vous voulez</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">0 CHF aujourd'hui</h3>
            <p className="text-xs text-gray-500 mt-1">Prélèvement différé</p>
          </div>
        </div>
      </main>
    </div>
  );
}
