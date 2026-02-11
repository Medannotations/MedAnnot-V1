/**
 * Stripe Service - Version sans Supabase
 * Utilise notre API backend maison
 */
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { getToken } from '@/services/api';

const API_URL = import.meta.env.VITE_API_URL || '/api';

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

export async function createCheckoutSession(params: CheckoutSessionParams): Promise<void> {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe n\'est pas initialise');
    }

    const token = getToken();
    const response = await fetch(`${API_URL}/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        priceId: params.priceId,
        email: params.email,
        userId: params.userId,
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/signup`,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
      throw new Error(error.error || 'Erreur lors de la creation de la session de paiement');
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
      throw new Error('Aucune URL de paiement recue');
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error('Erreur lors du paiement');
  }
}

export async function createCustomerPortalSession(userId: string): Promise<void> {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/stripe-portal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
      throw new Error(error.error || 'Erreur lors de la creation du portail client');
    }

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Erreur lors de l\'acces au portail');
  }
}
