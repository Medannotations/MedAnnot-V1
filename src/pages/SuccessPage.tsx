import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Mic, Clock, Stethoscope, Sparkles, Shield, FileText, Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(15);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    sessionStorage.setItem('successTimestamp', Date.now().toString());
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/app?from=success");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const features = [
    {
      icon: Mic,
      title: "Dictez naturellement",
      description: "Parlez, notre IA transcrit et structure automatiquement vos annotations.",
    },
    {
      icon: FileText,
      title: "Générez en 1 clic",
      description: "Vos annotations professionnelles prêtes à copier dans votre logiciel.",
    },
    {
      icon: Clock,
      title: "Gagnez 2h par jour",
      description: "Terminez vos annotations en quelques minutes au lieu d'heures.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-md py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex justify-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-gray-900">Med</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Annot</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Success Message */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mb-6 shadow-xl">
            <CheckCircle2 className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Bienvenue chez MedAnnot !
          </h1>
          
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Votre compte est prêt et votre essai gratuit de{" "}
            <span className="font-semibold text-emerald-600">7 jours</span> est actif.
          </p>
        </div>

        {/* What happens next */}
        <Card className="mb-8 border-emerald-100 bg-emerald-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Votre essai gratuit est protégé
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>7 jours complets sans aucun frais</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Accès illimité à toutes les fonctionnalités</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Annulation en 1 clic depuis votre espace</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Aucun engagement pendant l'essai</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Commencez dès maintenant
        </h2>
        
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-5 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={() => navigate("/app")}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-lg font-semibold px-10 py-6 rounded-xl shadow-xl transition-all"
          >
            <Play className="w-5 h-5 mr-2" />
            Accéder à mon espace
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="mt-4 text-sm text-gray-500">
            Redirection automatique dans{" "}
            <span className="font-semibold text-emerald-600">{countdown}s</span>
          </p>
          
          {user?.email && (
            <p className="mt-2 text-xs text-gray-400">
              Confirmation envoyée à {user.email}
            </p>
          )}
        </div>

        {/* Support */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Une question ? Contactez-nous à{" "}
            <a href="mailto:support@medannot.ch" className="text-blue-600 hover:underline">
              support@medannot.ch
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
