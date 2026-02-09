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
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!supabaseUrl || !serviceRoleKey || !stripeSecretKey || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Créer un client avec le JWT de l'utilisateur
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header required" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Client avec le JWT de l'utilisateur pour vérifier son identité
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Vérifier l'utilisateur authentifié
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const userId = user.id;
    console.log("Authenticated user:", userId);

    // Client avec service role pour accéder aux données
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
      stripe_customer_id: profile?.stripe_customer_id,
      subscription_status: profile?.subscription_status,
      error: profileError?.message,
    });

    if (profileError || !profile?.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: "Aucun abonnement Stripe trouvé pour ce compte" }),
        { status: 404, headers: corsHeaders }
      );
    }

    const customerId = profile.stripe_customer_id;

    // Lister TOUS les abonnements du client
    const listResponse = await fetch(
      `https://api.stripe.com/v1/subscriptions?customer=${customerId}&limit=10`,
      {
        headers: { "Authorization": `Bearer ${stripeSecretKey}` },
      }
    );

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error("Failed to list subscriptions:", errorText);
      return new Response(
        JSON.stringify({ error: "Impossible de récupérer les abonnements" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const allSubscriptions = await listResponse.json();
    console.log("All subscriptions found:", allSubscriptions.data?.length);

    // Trouver le premier abonnement annulable
    const cancellableStatuses = ["active", "trialing", "past_due", "incomplete"];
    const subscription = allSubscriptions.data?.find(
      (s: any) => cancellableStatuses.includes(s.status) && !s.cancel_at_period_end
    );

    const anySubscription = subscription || allSubscriptions.data?.find(
      (s: any) => cancellableStatuses.includes(s.status)
    );

    if (!anySubscription) {
      console.error("No cancellable subscription found for customer:", customerId);
      return new Response(
        JSON.stringify({
          error: "Aucun abonnement actif trouvé",
          debug: `Customer ${customerId}, ${allSubscriptions.data?.length || 0} subscriptions found`
        }),
        { status: 404, headers: corsHeaders }
      );
    }

    if (anySubscription.cancel_at_period_end) {
      const periodEnd = anySubscription.current_period_end
        ? new Date(anySubscription.current_period_end * 1000).toISOString()
        : null;
      return new Response(
        JSON.stringify({ success: true, periodEnd, alreadyCancelled: true }),
        { headers: corsHeaders }
      );
    }

    // Annuler à la fin de la période
    const cancelResponse = await fetch(
      `https://api.stripe.com/v1/subscriptions/${anySubscription.id}`,
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
    const periodEnd = cancelledSub.current_period_end
      ? new Date(cancelledSub.current_period_end * 1000).toISOString()
      : null;

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
