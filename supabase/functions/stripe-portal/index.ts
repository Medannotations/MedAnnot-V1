// Edge Function pour créer un portail client Stripe
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
    const body = await req.json();
    const { userId } = body;

    console.log("Creating portal session for user:", userId);

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    console.log("Environment check:", {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceRoleKey: !!serviceRoleKey,
      hasStripeSecretKey: !!stripeSecretKey,
    });

    if (!supabaseUrl || !serviceRoleKey || !stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Créer client Supabase avec service role
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Récupérer le profil avec stripe_customer_id
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("stripe_customer_id, email, subscription_status")
      .eq("user_id", userId)
      .single();

    console.log("Profile lookup result:", {
      found: !!profile,
      hasCustomerId: !!profile?.stripe_customer_id,
      error: profileError?.message,
    });

    if (profileError) {
      console.error("Profile lookup error:", profileError);
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: corsHeaders }
      );
    }

    let customerId = profile?.stripe_customer_id;

    // Si pas de customer_id mais abonnement actif, créer un customer Stripe
    if (!customerId && profile?.email) {
      console.log("No Stripe customer ID found, creating new customer...");
      
      try {
        // Créer le customer Stripe via API REST
        const customerResponse = await fetch("https://api.stripe.com/v1/customers", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${stripeSecretKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email: profile.email,
            "metadata[userId]": userId,
            "metadata[source]": "medannot_portal",
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

        // Sauvegarder le customer_id dans le profil
        const { error: updateError } = await supabaseClient
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        if (updateError) {
          console.error("Failed to update profile with customer ID:", updateError);
        } else {
          console.log("Created and saved Stripe customer:", customerId);
        }
      } catch (err) {
        console.error("Error creating Stripe customer:", err);
        return new Response(
          JSON.stringify({ error: "Failed to create Stripe customer" }),
          { status: 500, headers: corsHeaders }
        );
      }
    }

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: "No Stripe customer found and unable to create one" }),
        { status: 404, headers: corsHeaders }
      );
    }

    // Créer la session de portail Stripe
    console.log("Creating portal session for customer:", customerId);
    
    const origin = req.headers.get("origin") || "https://medannotv2.vercel.app";
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

      // Parse Stripe error for better messaging
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
    console.log("Portal session created:", session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("Error creating portal session:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
