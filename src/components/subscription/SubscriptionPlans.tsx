import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { createCheckoutSession } from '@/services/stripeService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const includedFeatures = [
  'Annotations illimitées',
  'Patients illimités',
  'Dictée vocale IA',
  'Suivi des signes vitaux',
  'Export PDF/Word',
  'Personnalisation complète',
  'Support prioritaire',
  'Données sécurisées (LPD)',
];

export function SubscriptionPlans() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour souscrire',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const priceId = import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY;

      if (!priceId) {
        throw new Error('ID de prix Stripe non configuré');
      }

      await createCheckoutSession({
        priceId,
        email: user.email,
        userId: user.id,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de créer la session de paiement',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Un seul tarif. Tout inclus.</h2>
        <p className="text-xl text-muted-foreground">149 CHF/mois — Sans engagement — 7 jours gratuits</p>
      </div>

      <Card className="relative bg-card border-2 border-primary shadow-2xl">
        <CardHeader className="text-center pb-8 pt-8">
          <div className="mb-6">
            <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
              149 CHF
            </div>
            <div className="text-lg text-muted-foreground">
              par mois
            </div>
          </div>

          {/* Badge essai gratuit */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
            <div className="text-center">
              <div className="text-xl font-bold text-green-700 mb-1">7 JOURS D'ESSAI GRATUIT</div>
              <div className="text-sm text-green-600">0 CHF pendant l'essai — Sans engagement</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <ul className="grid sm:grid-cols-2 gap-3">
            {includedFeatures.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-card-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="px-8 pb-8 flex-col gap-4">
          <Button
            size="xl"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg py-6 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
            onClick={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              'Commencer mon essai gratuit de 7 jours'
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            0 CHF pendant l'essai — Activation instantanée — 100% sécurisé
          </p>
        </CardFooter>
      </Card>

      {/* Trust signals */}
      <div className="mt-12 grid sm:grid-cols-3 gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm font-medium text-foreground">Sans engagement</p>
          <p className="text-xs text-muted-foreground">Résiliable en 2 clics</p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm font-medium text-foreground">0 CHF prélevé</p>
          <p className="text-xs text-muted-foreground">Pendant les 7 jours d'essai</p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm font-medium text-foreground">Satisfait ou remboursé</p>
          <p className="text-xs text-muted-foreground">30 jours garantis</p>
        </div>
      </div>
    </div>
  );
}
