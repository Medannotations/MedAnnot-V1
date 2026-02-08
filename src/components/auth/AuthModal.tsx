import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User, Eye, EyeOff, Stethoscope, ArrowRight } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const { login, signup } = useAuth();

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (!acceptTerms) {
          toast({
            title: "Erreur",
            description: "Veuillez accepter les conditions d'utilisation.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        await signup(email, password, name);
        toast({
          title: "Compte créé !",
          description: "Bienvenue sur MedAnnot. Votre essai gratuit commence maintenant.",
        });
      } else {
        await login(email, password);
        toast({
          title: "Connexion réussie",
          description: "Ravi de vous revoir !",
        });
      }
      onClose();
    } catch (error: any) {
      toast({
        title: mode === "login" ? "Erreur de connexion" : "Erreur d'inscription",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setAcceptTerms(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-slate-800 border border-white/15 shadow-2xl">
        {/* Header avec gradient */}
        <div className="relative bg-gradient-to-br from-slate-700 via-blue-900/50 to-teal-900/50 p-8 pb-10">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}
            />
          </div>
          
          <DialogHeader className="relative z-10">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-4">
              {mode === "login" ? (
                <Lock className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <DialogTitle className="text-2xl font-bold text-white text-center">
              {mode === "login" ? "Connexion" : "Créer un compte"}
            </DialogTitle>
            <DialogDescription className="text-white/60 text-center mt-2">
              {mode === "login"
                ? "Accédez à votre espace MedAnnot"
                : "7 jours gratuits — Sans aucun engagement"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form */}
        <div className="p-6 pt-4 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/80 text-sm font-medium">
                  Nom complet
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Dr. Marie Dupont"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 h-12 bg-slate-700/50 border-white/15 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80 text-sm font-medium">
                Email professionnel
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="marie@cabinet-medical.ch"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 h-12 bg-slate-700/50 border-white/15 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80 text-sm font-medium">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="pl-10 pr-12 h-12 bg-slate-700/50 border-white/15 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-white/40">Minimum 6 caractères</p>
            </div>

            {mode === "signup" && (
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  disabled={isLoading}
                  className="mt-1 border-white/30 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                />
                <Label htmlFor="terms" className="text-sm text-white/60 leading-relaxed cursor-pointer">
                  J'accepte les{" "}
                  <a href="/terms-of-service" className="text-cyan-400 hover:text-cyan-300 hover:underline" target="_blank" rel="noopener noreferrer">
                    conditions d'utilisation
                  </a>{" "}
                  et la{" "}
                  <a href="/privacy-policy" className="text-cyan-400 hover:text-cyan-300 hover:underline" target="_blank" rel="noopener noreferrer">
                    politique de confidentialité
                  </a>
                </Label>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || (mode === "signup" && !acceptTerms)}
              className="w-full h-12 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {mode === "login" ? "Connexion..." : "Création..."}
                </>
              ) : (
                <>
                  {mode === "login" ? "Se connecter" : "Créer mon compte"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-slate-800 text-white/40">
                {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}
              </span>
            </div>
          </div>

          {/* Toggle mode */}
          <Button
            type="button"
            variant="outline"
            onClick={toggleMode}
            disabled={isLoading}
            className="w-full h-11 bg-transparent border-white/10 text-white hover:bg-white/5 hover:border-white/20"
          >
            {mode === "login" ? "Créer un compte" : "Se connecter"}
          </Button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-white/50">
            <div className="flex items-center gap-1">
              <Stethoscope className="w-3 h-3 text-cyan-400" />
              <span><strong className="text-white/70">7 jours gratuits</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-teal-400" />
              <span>Sans engagement</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
