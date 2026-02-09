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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY")!;

    // Récupérer le token du header Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header missing" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Créer un client Supabase avec le token de l'utilisateur
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
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired session" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const userId = user.id;
    console.log("Reactivate - User:", userId);

    // Client admin pour accéder aux données
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: "Aucun abonnement trouvé" }),
        { status: 404, headers: corsHeaders }
      );
    }

    const customerId = profile.stripe_customer_id;

    // Lister les abonnements
    const listRes = await fetch(
      `https://api.stripe.com/v1/subscriptions?customer=${customerId}&limit=10`,
      { headers: { "Authorization": `Bearer ${stripeSecretKey}` } }
    );

    if (!listRes.ok) {
      return new Response(
        JSON.stringify({ error: "Erreur Stripe" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const subscriptions = await listRes.json();
    
    // Trouver l'abonnement programmé pour annulation
    const sub = subscriptions.data?.find((s: any) => 
      s.cancel_at_period_end === true
    );

    if (!sub) {
      return new Response(
        JSON.stringify({ error: "Aucun abonnement à réactiver" }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Réactiver l'abonnement
    const reactivateRes = await fetch(
      `https://api.stripe.com/v1/subscriptions/${sub.id}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ cancel_at_period_end: "false" }),
      }
    );

    if (!reactivateRes.ok) {
      const errorText = await reactivateRes.text();
      console.error("Reactivate error:", errorText);
      return new Response(
        JSON.stringify({ error: "Échec de la réactivation" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const reactivated = await reactivateRes.json();

    return new Response(
      JSON.stringify({
        success: true,
        status: reactivated.status,
      }),
      { headers: corsHeaders }
    );

  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
