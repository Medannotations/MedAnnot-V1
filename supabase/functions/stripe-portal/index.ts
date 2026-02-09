// Edge Function pour créer un portail client Stripe
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

// Décoder le JWT localement
function decodeJwt(token: string): { sub?: string; email?: string } | null {
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

    // Récupérer et décoder le JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7);
    const decoded = decodeJwt(token);
    
    if (!decoded?.sub) {
      return new Response(
        JSON.stringify({ error: "Invalid JWT token" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const userId = decoded.sub;
    console.log("Creating portal session for user:", userId);

    // Client admin Supabase
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Récupérer le profil
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("stripe_customer_id, email, subscription_status")
      .eq("user_id", userId)
      .single();

    console.log("Profile lookup:", {
      found: !!profile,
      hasCustomerId: !!profile?.stripe_customer_id,
      error: profileError?.message,
    });

    if (profileError) {
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    let customerId = profile?.stripe_customer_id;

    // Créer un customer Stripe si nécessaire
    if (!customerId && profile?.email) {
      console.log("Creating new Stripe customer...");
      
      const customerResponse = await fetch("https://api.stripe.com/v1/customers", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: profile.email,
          "metadata[userId]": userId,
        }),
      });

      if (!customerResponse.ok) {
        const errorText = await customerResponse.text();
        console.error("Stripe customer creation failed:", errorText);
        return new Response(
          JSON.stringify({ error: "Failed to create Stripe customer" }),
          { status: 500, headers: corsHeaders }
        );
      }

      const customer = await customerResponse.json();
      customerId = customer.id;

      // Sauvegarder le customer_id
      await supabaseClient
        .from("profiles")
        .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
    }

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: "No Stripe customer found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Créer la session de portail Stripe
    const origin = req.headers.get("origin") || "https://medannot-v1.vercel.app";
    const returnUrl = `${origin}/app/settings`;

    const portalResponse = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        customer: customerId,
        return_url: returnUrl,
      }),
    });

    if (!portalResponse.ok) {
      const errorText = await portalResponse.text();
      console.error("Stripe portal creation failed:", errorText);

      let errorMessage = "Failed to create portal session";
      try {
        const stripeError = JSON.parse(errorText);
        if (stripeError?.error?.message?.includes("No portal configuration")) {
          errorMessage = "Le portail client Stripe n'est pas configuré. Activez-le dans Stripe Dashboard > Settings > Billing > Customer portal.";
        } else if (stripeError?.error?.message) {
          errorMessage = stripeError.error.message;
        }
      } catch (_) {}

      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 500, headers: corsHeaders }
      );
    }

    const session = await portalResponse.json();
    console.log("Portal session created:", session.url);

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: corsHeaders }
    );

  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
