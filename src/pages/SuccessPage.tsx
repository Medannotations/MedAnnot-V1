import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Mic, Clock, Stethoscope, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(30);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/app");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const steps = [
    {
      icon: ArrowRight,
      title: "Accédez à votre espace",
      description: "Votre tableau de bord est prêt. Découvrez toutes les fonctionnalités.",
      primary: true,
    },
    {
      icon: Mic,
      title: "Dictez votre première annotation",
      description: "Parlez naturellement, notre IA transcrit et structure automatiquement.",
      primary: false,
    },
    {
      icon: Clock,
      title: "Gagnez 2h par jour",
      description: "Terminez vos annotations en quelques minutes au lieu d'heures.",
      primary: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-emerald-500 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              MedAnnot
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* Success Icon & Title */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mb-6 shadow-xl">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bienvenue dans MedAnnot! 🎉
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600">
            Votre compte est prêt.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 font-semibold">
              Vos soirées aussi.
            </span>
          </p>
        </div>

        {/* Steps Cards */}
        <div className="space-y-4 mb-8 sm:mb-12">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className={`animate-fade-in-up border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${
                step.primary 
                  ? "bg-gradient-to-r from-blue-600 to-emerald-500" 
                  : "bg-white"
              }`}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    step.primary 
                      ? "bg-white/20" 
                      : "bg-gradient-to-br from-blue-100 to-emerald-100"
                  }`}>
                    <step.icon className={`w-6 h-6 ${
                      step.primary ? "text-white" : "text-blue-600"
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-1 ${
                      step.primary ? "text-white" : "text-gray-900"
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${
                      step.primary ? "text-blue-100" : "text-gray-600"
                    }`}>
                      {step.description}
                    </p>
                    
                    {step.primary && (
                      <Button
                        onClick={() => navigate("/app")}
                        className="mt-4 bg-white text-blue-600 hover:bg-blue-50 font-bold px-6 py-2 rounded-lg shadow-lg touch-manipulation"
                      >
                        Accéder à mon espace
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    step.primary 
                      ? "bg-white/20 text-white" 
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {index + 1}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="animate-fade-in-up animation-delay-400 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-emerald-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Votre essai gratuit est actif
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>7 jours d'essai gratuit — aucun paiement maintenant</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Accès illimité à toutes les fonctionnalités</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Annulation en 1 clic depuis votre espace</span>
                  </li>
                  {user?.email && (
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Confirmation envoyée à {user.email}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <div className="mt-8 sm:mt-12 text-center animate-fade-in-up animation-delay-500">
          <Button
            onClick={() => navigate("/app")}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-lg font-bold px-8 sm:px-12 py-6 rounded-xl shadow-xl animate-pulse-glow touch-manipulation"
          >
            <span className="mr-2">🚀</span>
            Commencer maintenant
          </Button>
          
          <p className="mt-4 text-sm text-gray-500">
            Redirection automatique dans{" "}
            <span className="font-semibold text-blue-600">{countdown}s</span>
          </p>
        </div>

        {/* Session ID (for debugging) */}
        {sessionId && (
          <p className="text-center text-xs text-gray-400 mt-8">
            Session: {sessionId.slice(0, 8)}...
          </p>
        )}
      </main>
    </div>
  );
}
