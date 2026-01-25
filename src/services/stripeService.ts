import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('Stripe publishable key is not defined');
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

    // Appeler le backend pour créer la session
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: params.priceId,
        email: params.email,
        userId: params.userId,
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/subscription/cancel`,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
      throw new Error(error.error || 'Erreur lors de la création de la session de paiement');
    }

    const { sessionId } = await response.json();

    // Rediriger vers Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw new Error(error.message || 'Erreur lors de la redirection vers Stripe');
    }
  } catch (error) {
    console.error('Erreur checkout Stripe:', error);
    throw error instanceof Error ? error : new Error('Erreur lors du paiement');
  }
}

/**
 * Créer un portail client Stripe (pour gérer l'abonnement)
 */
export async function createCustomerPortalSession(customerId: string): Promise<void> {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/app/settings`,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
      throw new Error(error.error || 'Erreur lors de la création du portail client');
    }

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Erreur portail Stripe:', error);
    throw error instanceof Error ? error : new Error('Erreur lors de l\'accès au portail');
  }
}

/**
 * Obtenir les informations d'abonnement
 */
export async function getSubscriptionInfo(userId: string): Promise<{
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'none';
  currentPeriodEnd?: Date;
  planType?: 'monthly' | 'yearly';
}> {
  try {
    const response = await fetch(`/api/stripe/subscription/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { status: 'none' };
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur récupération abonnement:', error);
    return { status: 'none' };
  }
}
