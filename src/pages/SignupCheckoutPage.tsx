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

      if (signupError) {
        throw signupError;
      }

      if (!authData.user) {
        throw new Error("Erreur lors de la création du compte");
      }

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. Redirect to Stripe checkout
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            plan: selectedPlan,
            userId: authData.user.id,
            email: email,
            name: name,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création de la session de paiement");
      }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-950">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              MedAnnot
            </span>
          </button>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour</span>
          </Button>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Hero Badge */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex flex-col items-center">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-teal-500/25 mb-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                <div className="text-left">
                  <p className="text-3xl sm:text-4xl font-bold">0 CHF</p>
                  <p className="text-teal-100 text-sm font-medium">aujourd'hui</p>
                </div>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              Commencez votre essai gratuit
            </h1>
            <p className="text-white/70 max-w-md mx-auto text-sm sm:text-base">
              Testez MedAnnot pendant 7 jours sans payer. <br className="hidden sm:block"/>
              Annulez avant le <strong className="text-teal-400">{formattedTrialEnd}</strong> et vous ne serez pas débité.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Left: Plan Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Choisissez votre formule pour après l'essai
            </h2>
            <p className="text-sm text-white/60 -mt-2 mb-4">
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
                      ? "border-teal-500 bg-white/10 backdrop-blur-sm shadow-lg shadow-teal-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-4">
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-5 h-5 ${isSelected ? "text-teal-400" : "text-white/50"}`} />
                          <h3 className={`font-bold text-lg ${isSelected ? "text-white" : "text-white/80"}`}>
                            {plan.name}
                          </h3>
                        </div>
                        
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className={`text-3xl font-bold ${isSelected ? "text-teal-400" : "text-white"}`}>
                            {plan.price}
                          </span>
                          <span className="text-white/60 font-medium">CHF</span>
                          <span className="text-white/40">{plan.period}</span>
                        </div>
                        
                        <p className={`text-sm ${isSelected ? "text-teal-300" : "text-white/60"}`}>
                          {plan.engagement}
                        </p>

                        <ul className="mt-3 space-y-1">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                              <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-all ${
                        isSelected
                          ? "border-teal-500 bg-teal-500"
                          : "border-white/30"
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Info box */}
            <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white font-medium">
                    Quand serez-vous débité ?
                  </p>
                  <p className="text-sm text-white/70 mt-1">
                    <strong className="text-white">Aujourd'hui : 0 CHF</strong> (essai gratuit)<br/>
                    <strong className="text-white">Le {formattedTrialEnd}</strong> : {selectedPlan === "monthly" ? "149 CHF" : "125 CHF"} si vous continuez<br/>
                    <span className="text-white/50">Ensuite : tous les mois à la même date</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Signup Form */}
          <div>
            <Card className="shadow-2xl border-0 bg-slate-800/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Créez votre compte
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/90 font-medium text-sm">
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
                      className="h-12 border-white/10 bg-slate-700/50 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/90 font-medium text-sm">
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
                      className="h-12 border-white/10 bg-slate-700/50 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/90 font-medium text-sm">
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
                        className="h-12 pr-12 border-white/10 bg-slate-700/50 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
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
                      className="mt-1 border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <Label htmlFor="terms" className="text-sm text-white/70 leading-relaxed cursor-pointer">
                      J'accepte les{" "}
                      <a href="/terms-of-service" className="text-blue-400 hover:text-blue-300 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                        CGV
                      </a>{" "}
                      et la{" "}
                      <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                        confidentialité
                      </a>
                    </Label>
                  </div>

                  {/* CTA */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all"
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
                    <p className="text-center text-xs text-white/50 mt-2">
                      Carte bancaire requise mais <strong className="text-white/70">aucun prélèvement aujourd'hui</strong>
                    </p>
                  </div>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1 text-xs text-white/50">
                      <Lock className="w-3 h-3" />
                      SSL sécurisé
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/50">
                      <Calendar className="w-3 h-3" />
                      7 jours gratuits
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/50">
                      <Check className="w-3 h-3" />
                      Annulation facile
                    </div>
                  </div>

                  <p className="text-center text-sm text-white/50 pt-2">
                    Déjà un compte ?{" "}
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
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

        {/* Guarantees */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="font-semibold text-white text-sm">7 jours gratuits</h3>
            <p className="text-xs text-white/50 mt-1">Testez sans risque</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white text-sm">Sans engagement</h3>
            <p className="text-xs text-white/50 mt-1">Annulez quand vous voulez</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-white text-sm">0 CHF aujourd'hui</h3>
            <p className="text-xs text-white/50 mt-1">Prélèvement différé</p>
          </div>
        </div>
      </main>
    </div>
  );
}
