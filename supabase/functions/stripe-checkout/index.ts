import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY is not set!");
      return new Response(
        JSON.stringify({ error: "Stripe configuration error: Missing API key" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const { priceId, email, userId, successUrl, cancelUrl } = await req.json();

    if (!priceId || !email || !userId) {
      throw new Error("Missing required parameters");
    }

    // Déterminer l'origin avec fallback robuste
    const rawOrigin = req.headers.get("origin");
    const origin = (rawOrigin && rawOrigin !== "" && rawOrigin !== "null")
      ? rawOrigin
      : "https://medannot-v1.vercel.app";

    console.log("Creating Stripe Checkout session with fetch API...");
    console.log("Origin:", origin);
    console.log("Price ID:", priceId);
    console.log("Email:", email);

    // Créer la session Stripe avec l'API REST directement
    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "mode": "subscription",
        "payment_method_types[0]": "card",
        "line_items[0][price]": priceId,
        "line_items[0][quantity]": "1",
        "customer_email": email,
        "client_reference_id": userId,
        "success_url": successUrl || `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        "cancel_url": cancelUrl || `${origin}/signup`,
        "subscription_data[trial_period_days]": "7",
        "subscription_data[metadata][userId]": userId,
        "metadata[userId]": userId,
      }),
    });

    if (!stripeResponse.ok) {
      const errorData = await stripeResponse.text();
      console.error("Stripe API error:", errorData);
      throw new Error(`Stripe API error: ${errorData}`);
    }

    const session = await stripeResponse.json();

    console.log("Session created successfully:", session.id);

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
