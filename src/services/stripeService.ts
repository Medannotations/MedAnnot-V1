import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';

let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      return null;
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export interface CheckoutSessionParams {
  priceId: string;
  email: string;
  userId: string;
}

/**
 * Créer une session de checkout Stripe
 */
export async function createCheckoutSession(params: CheckoutSessionParams): Promise<void> {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe n\'est pas initialisé');
    }

    const { data: sessionData } = await supabase.auth.getSession();

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          priceId: params.priceId,
          email: params.email,
          userId: params.userId,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/signup`,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
      throw new Error(error.error || 'Erreur lors de la création de la session de paiement');
    }

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else if (data.sessionId) {
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (error) {
        throw new Error(error.message || 'Erreur lors de la redirection vers Stripe');
      }
    } else {
      throw new Error('Aucune URL de paiement reçue');
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error('Erreur lors du paiement');
  }
}

/**
 * Créer un portail client Stripe (pour gérer l'abonnement)
 */
export async function createCustomerPortalSession(userId: string): Promise<void> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-portal`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session?.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
      throw new Error(error.error || 'Erreur lors de la création du portail client');
    }

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Erreur lors de l\'accès au portail');
  }
}
