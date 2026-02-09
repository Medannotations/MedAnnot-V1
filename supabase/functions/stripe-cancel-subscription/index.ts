// Version PUBLIC - authentification manuelle
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

// Décoder le JWT manuellement
function getUserIdFromToken(token: string): string | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    const decoded = JSON.parse(jsonPayload);
    return decoded.sub || null;
  } catch {
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
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token manquant" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Extraire l'userId du JWT
    const userId = getUserIdFromToken(token);
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Token invalide" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Client admin
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Récupérer le stripe_customer_id
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

    // Lister les abonnements Stripe
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
    const sub = subscriptions.data?.find((s: any) => 
      ["active", "trialing", "past_due"].includes(s.status)
    );

    if (!sub) {
      return new Response(
        JSON.stringify({ error: "Aucun abonnement actif" }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Déjà annulé ?
    if (sub.cancel_at_period_end) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          alreadyCancelled: true,
          periodEnd: sub.current_period_end 
            ? new Date(sub.current_period_end * 1000).toISOString() 
            : null 
        }),
        { headers: corsHeaders }
      );
    }

    // Annuler
    const cancelRes = await fetch(
      `https://api.stripe.com/v1/subscriptions/${sub.id}`,
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
      return new Response(
        JSON.stringify({ error: "Échec de l'annulation" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const cancelled = await cancelRes.json();
    
    return new Response(
      JSON.stringify({
        success: true,
        periodEnd: cancelled.current_period_end
          ? new Date(cancelled.current_period_end * 1000).toISOString()
          : null
      }),
      { headers: corsHeaders }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
