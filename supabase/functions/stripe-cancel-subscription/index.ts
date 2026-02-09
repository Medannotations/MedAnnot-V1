import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

// Décoder le JWT localement (ne pas appeler Supabase Auth)
function decodeJwt(token: string): { sub?: string; email?: string } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT decode error:", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY")!;

    // Récupérer le token
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header missing" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token || token === authHeader) {
      return new Response(
        JSON.stringify({ error: "Invalid Authorization format" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Décoder le JWT localement (Supabase l'a déjà validé en mode Protected)
    const decoded = decodeJwt(token);
    console.log("Decoded JWT payload:", decoded);
    
    if (!decoded?.sub) {
      return new Response(
        JSON.stringify({ error: "Invalid JWT: no sub claim" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const userId = decoded.sub;
    console.log("User ID from JWT:", userId);

    // Client admin pour accéder aux données
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Récupérer le stripe_customer_id
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("stripe_customer_id, subscription_status")
      .eq("user_id", userId)
      .single();

    console.log("Profile lookup:", { 
      userId, 
      found: !!profile, 
      customerId: profile?.stripe_customer_id,
      error: profileError?.message 
    });

    if (profileError || !profile?.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: "Aucun abonnement Stripe trouvé" }),
        { status: 404, headers: corsHeaders }
      );
    }

    const customerId = profile.stripe_customer_id;

    // Lister les abonnements Stripe
    const listResponse = await fetch(
      `https://api.stripe.com/v1/subscriptions?customer=${customerId}&limit=10`,
      {
        headers: { "Authorization": `Bearer ${stripeSecretKey}` },
      }
    );

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error("Stripe list error:", errorText);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la récupération des abonnements" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const allSubscriptions = await listResponse.json();
    console.log("Stripe subscriptions:", allSubscriptions.data?.length);

    // Trouver un abonnement annulable
    const cancellableStatuses = ["active", "trialing", "past_due", "incomplete"];
    const subscription = allSubscriptions.data?.find(
      (s: any) => cancellableStatuses.includes(s.status) && !s.cancel_at_period_end
    );

    const anySubscription = subscription || allSubscriptions.data?.find(
      (s: any) => cancellableStatuses.includes(s.status)
    );

    if (!anySubscription) {
      console.error("No cancellable subscription found");
      return new Response(
        JSON.stringify({ error: "Aucun abonnement actif trouvé" }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Déjà annulé ?
    if (anySubscription.cancel_at_period_end) {
      const periodEnd = anySubscription.current_period_end
        ? new Date(anySubscription.current_period_end * 1000).toISOString()
        : null;
      console.log("Already cancelled, period end:", periodEnd);
      return new Response(
        JSON.stringify({ success: true, periodEnd, alreadyCancelled: true }),
        { headers: corsHeaders }
      );
    }

    // Annuler l'abonnement
    console.log("Cancelling subscription:", anySubscription.id);
    const cancelResponse = await fetch(
      `https://api.stripe.com/v1/subscriptions/${anySubscription.id}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ cancel_at_period_end: "true" }),
      }
    );

    if (!cancelResponse.ok) {
      const errorText = await cancelResponse.text();
      console.error("Stripe cancel error:", errorText);
      return new Response(
        JSON.stringify({ error: "Impossible d'annuler l'abonnement" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const cancelledSub = await cancelResponse.json();
    const periodEnd = cancelledSub.current_period_end
      ? new Date(cancelledSub.current_period_end * 1000).toISOString()
      : null;

    console.log("Cancelled successfully, period end:", periodEnd);

    return new Response(
      JSON.stringify({ success: true, periodEnd }),
      { headers: corsHeaders }
    );

  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
