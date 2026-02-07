import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function SubscriptionGuard({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Attendre que l'auth soit initialisée
    if (isLoading) return;

    // Pas connecté → redirection
    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    // Simuler une vérification rapide (2 secondes max)
    const timer = setTimeout(() => {
      console.log("Access granted to user:", user.id);
      setChecking(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [user, isLoading, navigate]);

  // Timeout de sécurité maximum 5 secondes
  useEffect(() => {
    const maxTimeout = setTimeout(() => {
      if (checking) {
        console.log("Max timeout reached - forcing access");
        setChecking(false);
      }
    }, 5000);

    return () => clearTimeout(maxTimeout);
  }, [checking]);

  if (isLoading || checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement de votre espace...</p>
          <p className="text-xs text-muted-foreground">Si ça prend plus de 5s, </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setChecking(false)}
            className="mt-2"
          >
            Forcer l'accès
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="bg-destructive/10 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Problème de connexion</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => window.location.reload()} className="w-full">
              Réessayer
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="w-full">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
