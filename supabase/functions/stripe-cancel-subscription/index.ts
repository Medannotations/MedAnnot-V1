import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!supabaseUrl || !serviceRoleKey || !stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Récupérer le stripe_customer_id
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      console.error("Profile lookup error:", profileError);
      return new Response(
        JSON.stringify({ error: "Aucun abonnement Stripe trouvé" }),
        { status: 404, headers: corsHeaders }
      );
    }

    const customerId = profile.stripe_customer_id;
    console.log("Cancelling subscription for customer:", customerId);

    // Lister les abonnements actifs
    const listResponse = await fetch(
      `https://api.stripe.com/v1/subscriptions?customer=${customerId}&status=active&limit=1`,
      {
        headers: { "Authorization": `Bearer ${stripeSecretKey}` },
      }
    );

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error("Failed to list subscriptions:", errorText);
      return new Response(
        JSON.stringify({ error: "Impossible de récupérer l'abonnement" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const subscriptions = await listResponse.json();

    // Essayer aussi les abonnements trialing
    let subscription = subscriptions.data?.[0];
    if (!subscription) {
      const trialingResponse = await fetch(
        `https://api.stripe.com/v1/subscriptions?customer=${customerId}&status=trialing&limit=1`,
        {
          headers: { "Authorization": `Bearer ${stripeSecretKey}` },
        }
      );
      if (trialingResponse.ok) {
        const trialingSubs = await trialingResponse.json();
        subscription = trialingSubs.data?.[0];
      }
    }

    if (!subscription) {
      return new Response(
        JSON.stringify({ error: "Aucun abonnement actif trouvé" }),
        { status: 404, headers: corsHeaders }
      );
    }

    console.log("Found subscription:", subscription.id, "status:", subscription.status);

    // Annuler à la fin de la période (pas immédiatement)
    const cancelResponse = await fetch(
      `https://api.stripe.com/v1/subscriptions/${subscription.id}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          cancel_at_period_end: "true",
        }),
      }
    );

    if (!cancelResponse.ok) {
      const errorText = await cancelResponse.text();
      console.error("Failed to cancel subscription:", errorText);
      return new Response(
        JSON.stringify({ error: "Impossible d'annuler l'abonnement" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const cancelledSub = await cancelResponse.json();
    const periodEnd = new Date(cancelledSub.current_period_end * 1000).toISOString();

    console.log("Subscription cancelled at period end:", periodEnd);

    return new Response(
      JSON.stringify({ success: true, periodEnd }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
