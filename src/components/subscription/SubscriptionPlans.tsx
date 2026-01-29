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
  'Stockage illimité',
  'Export PDF/Word',
  'Personnalisation complète',
  'Support prioritaire',
  'Mises à jour incluses',
  'Données sécurisées (LPD)',
];

export function SubscriptionPlans() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
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
      const priceId =
        billingPeriod === 'monthly'
          ? import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY
          : import.meta.env.VITE_STRIPE_PRICE_ID_YEARLY;

      if (!priceId) {
        throw new Error('ID de prix Stripe non configuré');
      }

      await createCheckoutSession({
        priceId,
        email: user.email,
        userId: user.id,
      });
    } catch (error) {
      console.error('Erreur souscription:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de créer la session de paiement',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Choisissez votre formule</h2>
        <p className="text-xl text-muted-foreground">Un seul forfait. Tout inclus. Sans limitation.</p>
      </div>

      {/* Toggle Mensuel/Annuel */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-muted rounded-lg p-1 border border-border">
          <button
            onClick={() => setBillingPeriod('monthly')}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg transition-all font-medium ${
              billingPeriod === 'monthly'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg transition-all font-medium relative ${
              billingPeriod === 'yearly'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Annuel
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
              -45%
            </span>
          </button>
        </div>
      </div>

      {/* Card de prix */}
      <Card className="relative bg-card border-2 border-primary shadow-2xl">
        <CardHeader className="text-center pb-8 pt-8">
          <div className="mb-6">
            <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">
              {billingPeriod === 'monthly' ? '149' : '989'} CHF
            </div>
            <div className="text-lg text-muted-foreground">
              {billingPeriod === 'monthly' ? 'par mois' : 'par an'}
            </div>
            {billingPeriod === 'yearly' && (
              <div className="mt-3 text-green-600 font-semibold text-lg">
                Soit 82 CHF/mois • Économisez 799 CHF ! 🎉
              </div>
            )}
          </div>

          {/* Badge essai gratuit */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
            <div className="text-center">
              <div className="text-xl font-bold text-green-700 mb-1">✅ 7 JOURS D'ESSAI GRATUIT</div>
              <div className="text-sm text-green-600">0 CHF prélevé pendant l'essai • Sans engagement</div>
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
            0 CHF pendant l'essai • Activation instantanée • 100% sécurisé 🔒
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
          <p className="text-xs text-muted-foreground">Résiliable en 1 clic à tout moment</p>
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
