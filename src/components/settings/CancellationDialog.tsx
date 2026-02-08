import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Mic,
  FileText,
  Clock,
  Activity,
  Users,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CancellationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  periodEnd: Date | null;
  userId: string;
  onCancelled: () => void;
}

export function CancellationDialog({
  open,
  onOpenChange,
  periodEnd,
  userId,
  onCancelled,
}: CancellationDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setStep(1);
    onOpenChange(false);
  };

  const handleConfirmCancel = async () => {
    setIsLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-cancel-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors de la résiliation");
      }

      const data = await response.json();

      toast({
        title: "Résiliation confirmée",
        description: `Votre abonnement reste actif jusqu'au ${
          data.periodEnd
            ? format(new Date(data.periodEnd), "d MMMM yyyy", { locale: fr })
            : "la fin de la période"
        }.`,
      });

      onCancelled();
      handleClose();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de résilier l'abonnement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: Mic,
      title: "Dictée vocale illimitée",
      desc: "Plus besoin de taper vos annotations une par une",
    },
    {
      icon: FileText,
      title: "Annotations IA automatiques",
      desc: "Le travail le plus chronophage, fait en quelques secondes",
    },
    {
      icon: Users,
      title: "Gestion complète des patients",
      desc: "Tout votre cabinet, accessible en un clic",
    },
    {
      icon: Clock,
      title: "2 heures gagnées par jour",
      desc: "Du temps retrouvé pour vos patients et votre vie personnelle",
    },
    {
      icon: Activity,
      title: "Suivi des signes vitaux",
      desc: "Visualisation claire et historique complet",
    },
  ];

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-lg">
        {step === 1 ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                Êtes-vous sûr de vouloir nous quitter ?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                En résiliant, vous perdez l'accès à tous ces avantages :
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-3 my-4">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{b.title}</p>
                      <p className="text-xs text-muted-foreground">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              Sans MedAnnot, vous retournez aux annotations manuelles — ces
              tâches complexes et chronophages qui vous prennent des heures
              chaque jour.
            </p>

            <AlertDialogFooter className="mt-4">
              <Button onClick={handleClose} className="flex-1">
                Garder mon abonnement
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStep(2)}
                className="flex-1 text-muted-foreground"
              >
                Je souhaite quand même résilier
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Confirmation de résiliation
              </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4 space-y-3">
              <p className="text-sm text-amber-800">
                Votre abonnement restera actif jusqu'au{" "}
                <strong>
                  {periodEnd
                    ? format(periodEnd, "d MMMM yyyy", { locale: fr })
                    : "la fin de la période en cours"}
                </strong>
                .
              </p>
              <p className="text-sm text-amber-800">Après cette date :</p>
              <ul className="text-sm text-amber-800 space-y-1 ml-4 list-disc">
                <li>Vous n'aurez plus accès à vos annotations</li>
                <li>Vous n'aurez plus accès à l'historique patient</li>
                <li>La dictée vocale ne sera plus disponible</li>
              </ul>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setStep(1)}>
                Annuler
              </AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleConfirmCancel}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Confirmer la résiliation
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
