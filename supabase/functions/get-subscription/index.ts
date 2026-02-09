import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  httpClient: Stripe.createFetchHttpClient(),
});

function decodeJwt(token: string): { sub?: string } | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

serve(async (req) => {
  const origin = req.headers.get("origin") || "*";

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, content-type, apikey",
      },
    });
  }

  try {
    // Décoder le JWT manuellement (auth.getUser() ne marche pas dans Edge Functions)
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Missing authorization token" }),
        { 
          status: 401, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin 
          } 
        }
      );
    }

    const decoded = decodeJwt(token);
    const userId = decoded?.sub;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { 
          status: 401, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin 
          } 
        }
      );
    }

    // Chercher le customer Stripe par metadata user_id
    const customers = await stripe.customers.list({
      limit: 1,
    });
    
    const customer = customers.data.find(
      (c) => c.metadata?.user_id === userId
    );

    if (!customer) {
      return new Response(
        JSON.stringify({ 
          hasSubscription: false,
          message: "No customer found"
        }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin 
          } 
        }
      );
    }

    // Récupérer la subscription active
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 1,
      expand: ["data.latest_invoice"],
    });

    const subscription = subscriptions.data[0];

    if (!subscription) {
      return new Response(
        JSON.stringify({ 
          hasSubscription: false,
          customerId: customer.id,
        }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin 
          } 
        }
      );
    }

    // Formater la réponse avec les données fraîches de Stripe
    const response = {
      hasSubscription: true,
      customerId: customer.id,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at,
        endedAt: subscription.ended_at,
        planName: subscription.items.data[0]?.plan?.nickname || 
                  subscription.items.data[0]?.price?.nickname ||
                  "Abonnement MedAnnot",
        amount: subscription.items.data[0]?.plan?.amount || 
                subscription.items.data[0]?.price?.unit_amount,
        currency: subscription.currency,
      },
      // Prochaine facture si disponible
      upcomingInvoice: subscription.latest_invoice && typeof subscription.latest_invoice !== "string"
        ? {
            amountDue: subscription.latest_invoice.amount_due,
            status: subscription.latest_invoice.status,
            nextPaymentAttempt: subscription.latest_invoice.next_payment_attempt,
          }
        : null,
    };

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin 
        } 
      }
    );

  } catch (error: any) {
    console.error("Error fetching subscription:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch subscription",
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin 
        } 
      }
    );
  }
});
