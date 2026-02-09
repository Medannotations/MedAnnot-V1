import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

// Décoder le JWT localement
function decodeJwt(token: string): { sub?: string } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header missing" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = decodeJwt(token);
    
    if (!decoded?.sub) {
      return new Response(
        JSON.stringify({ error: "Invalid JWT" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const userId = decoded.sub;
    console.log("Reactivate - User:", userId);

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
    const sub = subscriptions.data?.find((s: any) => s.cancel_at_period_end === true);

    if (!sub) {
      return new Response(
        JSON.stringify({ error: "Aucun abonnement à réactiver" }),
        { status: 404, headers: corsHeaders }
      );
    }

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
      JSON.stringify({ success: true, status: reactivated.status }),
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
