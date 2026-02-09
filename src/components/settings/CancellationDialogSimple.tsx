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
import { subscription as subscriptionApi } from "@/services/api";
import {
  Mic,
  FileText,
  Clock,
  Activity,
  Users,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CancellationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  periodEnd: Date | null;
  onCancelled: () => void;
}

export function CancellationDialog({
  open,
  onOpenChange,
  periodEnd,
  onCancelled,
}: CancellationDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setStep(1);
    onOpenChange(false);
  };

  // Ouvrir le portail Stripe pour annuler
  const handleOpenStripePortal = async () => {
    setIsLoading(true);
    try {
      const url = await subscriptionApi.createPortal();
      
      // Ouvrir Stripe dans un nouvel onglet
      window.open(url, "_blank");
      
      toast({
        title: "Portail Stripe ouvert",
        description: "Annulez votre abonnement depuis Stripe, puis revenez ici. La page se mettra à jour automatiquement.",
      });
      
      onCancelled();
      handleClose();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ouvrir le portail de gestion",
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

            <AlertDialogFooter className="flex-col gap-2">
              <Button
                variant="destructive"
                onClick={handleOpenStripePortal}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4 mr-2" />
                )}
                Gérer mon abonnement sur Stripe
              </Button>
              <AlertDialogCancel onClick={() => setStep(1)} className="w-full">
                Annuler
              </AlertDialogCancel>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
