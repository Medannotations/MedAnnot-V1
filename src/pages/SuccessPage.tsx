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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-950">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 bg-slate-900/50 backdrop-blur-xl py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex justify-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              MedAnnot
            </span>
          </Link>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Success Message */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mb-6 shadow-xl shadow-teal-500/25">
            <CheckCircle2 className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Bienvenue chez MedAnnot !
          </h1>
          
          <p className="text-lg text-white/70 max-w-lg mx-auto">
            Votre compte est prêt et votre essai gratuit de{" "}
            <span className="font-semibold text-teal-400">7 jours</span> est actif.
          </p>
        </div>

        {/* What happens next */}
        <Card className="mb-8 border-teal-500/20 bg-teal-500/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">
                  Votre essai gratuit est protégé
                </h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>7 jours complets sans aucun frais</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>Accès illimité à toutes les fonctionnalités</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>Annulation en 1 clic depuis votre espace</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>Aucun engagement pendant l'essai</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <h2 className="text-lg font-semibold text-white mb-4 text-center">
          Commencez dès maintenant
        </h2>
        
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/5 backdrop-blur-sm border border-white/10">
                <CardContent className="p-5 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-white/60">{feature.description}</p>
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
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white text-lg font-semibold px-10 py-6 rounded-xl shadow-xl shadow-blue-500/25 transition-all"
          >
            <Play className="w-5 h-5 mr-2" />
            Accéder à mon espace
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="mt-4 text-sm text-white/50">
            Redirection automatique dans{" "}
            <span className="font-semibold text-teal-400">{countdown}s</span>
          </p>
          
          {user?.email && (
            <p className="mt-2 text-xs text-white/40">
              Confirmation envoyée à {user.email}
            </p>
          )}
        </div>

        {/* Support */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/50">
            Une question ? Contactez-nous à{" "}
            <a href="mailto:support@medannot.ch" className="text-blue-400 hover:text-blue-300 hover:underline">
              support@medannot.ch
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
