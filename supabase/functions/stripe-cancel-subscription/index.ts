// Version ultra-simple pour tester
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req) => {
  console.log("=== FUNCTION CALLED ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // En mode Protected, Supabase a déjà validé le JWT
    // On peut donc simplement traiter la requête
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY")!;

    // Extraire userId du JWT dans le header (déjà validé par Supabase)
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header:", authHeader?.substring(0, 50) + "...");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7); // Enlever "Bearer "
    
    // Décoder le JWT pour obtenir le sub (userId)
    let userId: string | null = null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = atob(base64);
      const payload = JSON.parse(jsonPayload);
      userId = payload.sub;
      console.log("UserId from JWT:", userId);
    } catch (e) {
      console.error("Failed to decode JWT:", e);
      return new Response(
        JSON.stringify({ error: "Invalid JWT format" }),
        { status: 401, headers: corsHeaders }
      );
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "No userId in token" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Client admin
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Récupérer le customer Stripe
    const { data: profile, error: profileErr } = await adminClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    console.log("Profile:", profile, "Error:", profileErr);

    if (!profile?.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: "No Stripe customer found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    const customerId = profile.stripe_customer_id;

    // Lister abonnements Stripe
    const listRes = await fetch(
      `https://api.stripe.com/v1/subscriptions?customer=${customerId}&status=active&limit=1`,
      { headers: { "Authorization": `Bearer ${stripeSecretKey}` } }
    );

    if (!listRes.ok) {
      const err = await listRes.text();
      console.error("Stripe error:", err);
      return new Response(
        JSON.stringify({ error: "Stripe API error" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const subs = await listRes.json();
    console.log("Active subscriptions:", subs.data?.length);

    if (!subs.data || subs.data.length === 0) {
      return new Response(
        JSON.stringify({ error: "No active subscription found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    const subscription = subs.data[0];

    // Si déjà annulé
    if (subscription.cancel_at_period_end) {
      const periodEnd = subscription.current_period_end 
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null;
      return new Response(
        JSON.stringify({ success: true, alreadyCancelled: true, periodEnd }),
        { headers: corsHeaders }
      );
    }

    // Annuler
    const cancelRes = await fetch(
      `https://api.stripe.com/v1/subscriptions/${subscription.id}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ cancel_at_period_end: "true" }),
      }
    );

    if (!cancelRes.ok) {
      const err = await cancelRes.text();
      console.error("Cancel error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to cancel subscription" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const cancelled = await cancelRes.json();
    const periodEnd = cancelled.current_period_end 
      ? new Date(cancelled.current_period_end * 1000).toISOString()
      : null;

    console.log("Cancelled successfully");
    
    return new Response(
      JSON.stringify({ success: true, periodEnd }),
      { headers: corsHeaders }
    );

  } catch (error: any) {
    console.error("Fatal error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
