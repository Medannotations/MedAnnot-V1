import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Mail, FileText, Headphones } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(60);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Auto-redirect après 60 secondes (temps pour que le webhook Stripe se traite)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Icon & Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue chez Medannot !
          </h1>
          <p className="text-xl text-gray-600">
            Votre compte est actif et votre période d'essai gratuit a commencé
          </p>
        </div>

        {/* Main Card */}
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Prochaines étapes</CardTitle>
            <CardDescription className="text-blue-100">
              Voici comment accéder à votre espace et commencer à utiliser Medannot
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Accédez à votre espace</h3>
                  <p className="text-gray-600 mb-3">
                    Votre compte est déjà configuré. Cliquez sur le bouton ci-dessous pour accéder immédiatement à votre tableau de bord.
                  </p>
                  <Button
                    onClick={() => navigate("/app")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Accéder à mon espace
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Redirection automatique dans {countdown} secondes...
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 pt-6 border-t">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Créez votre première annotation</h3>
                  <p className="text-gray-600">
                    Ajoutez un patient, puis créez votre première annotation médicale. Notre IA vous assistera pour gagner du temps.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 pt-6 border-t">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Vérifiez votre email</h3>
                  <p className="text-gray-600">
                    Nous vous avons envoyé un email de confirmation avec tous les détails de votre abonnement et des conseils pour bien démarrer.
                  </p>
                  {user?.email && (
                    <p className="text-sm text-blue-600 mt-2 font-medium">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email envoyé à {user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Essai gratuit actif</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Profitez de 7 jours d'essai gratuit. Aucun paiement ne sera effectué avant la fin de cette période.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Consultez nos guides pour maîtriser toutes les fonctionnalités de Medannot.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Voir les guides
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Headphones className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Support prioritaire</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Notre équipe est disponible pour répondre à toutes vos questions.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contacter le support
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Important Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Informations importantes
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Vos identifiants de connexion : {user?.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Période d'essai : 7 jours gratuits sans engagement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Vous pouvez annuler à tout moment depuis votre espace</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Nous ne facturerons rien avant la fin de votre essai</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Session ID (for debugging) */}
        {sessionId && (
          <p className="text-center text-xs text-gray-400 mt-6">
            Session ID: {sessionId}
          </p>
        )}
      </div>
    </div>
  );
}
