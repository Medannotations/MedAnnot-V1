import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check, ArrowLeft, Eye, EyeOff, Stethoscope, Shield, Clock, Sparkles, Lock, Mail, User } from "lucide-react";
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
      description: "Sans engagement",
      engagement: "Résiliable à tout moment",
      icon: Clock,
      features: [
        "Annotations illimitées",
        "Patients illimités",
        "7 jours d'essai gratuit",
        "Sans engagement",
      ],
    },
    {
      id: "yearly" as const,
      name: "Annuel",
      price: "125",
      period: "/mois",
      description: "Engagement 12 mois",
      engagement: "Paiement mensuel échelonné",
      icon: Shield,
      badge: "Économisez 288 CHF/an",
      recommended: true,
      features: [
        "Tout du plan mensuel",
        "7 jours d'essai gratuit",
        "Économisez 16%",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Title Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            7 jours d'essai gratuit — 0 CHF aujourd'hui
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Créez votre compte MedAnnot
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            Rejoignez des centaines d'infirmiers qui gagnent 2h par jour
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Left: Plan Selection (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Choisissez votre formule
            </h2>

            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;
              
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-4">
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        <Sparkles className="w-3 h-3" />
                        RECOMMANDÉ
                      </span>
                    </div>
                  )}
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />
                          <h3 className={`font-bold ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                            {plan.name}
                          </h3>
                        </div>
                        
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className={`text-3xl font-bold ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
                            {plan.price}
                          </span>
                          <span className="text-gray-500 font-medium">CHF</span>
                          <span className="text-gray-400">{plan.period}</span>
                        </div>
                        
                        <p className={`text-sm mt-1 ${isSelected ? "text-blue-600" : "text-gray-500"}`}>
                          {plan.description}
                        </p>
                        
                        <p className="text-xs text-gray-400 mt-1">
                          {plan.engagement}
                        </p>

                        {plan.badge && (
                          <span className="inline-block mt-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Info box */}
            <div className="bg-blue-50 rounded-xl p-4 mt-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Information :</strong> Les deux formules sont payées mensuellement. 
                Le plan Annuel vous engage sur 12 mois avec paiement échelonné.
              </p>
            </div>
          </div>

          {/* Right: Signup Form (3 cols) */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0 bg-white">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Vos informations
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
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
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-gray-50/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
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
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-gray-50/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-400" />
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
                        className="h-12 pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-gray-50/50"
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
                        conditions générales
                      </a>{" "}
                      et la{" "}
                      <a href="/privacy-policy" className="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                        politique de confidentialité
                      </a>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Création en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Démarrer mon essai gratuit
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Lock className="w-3 h-3" />
                      Paiement sécurisé SSL
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      7 jours gratuits
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
      </main>
    </div>
  );
}
