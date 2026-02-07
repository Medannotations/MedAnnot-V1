import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    console.log("Environment check:", {
      hasWebhookSecret: !!STRIPE_WEBHOOK_SECRET,
      hasSupabaseUrl: !!SUPABASE_URL,
      hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY,
    });

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the raw body
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    console.log("Request received:", {
      hasSignature: !!signature,
      bodyLength: body.length,
    });

    // Parse the event
    let event;
    try {
      event = JSON.parse(body);
    } catch (err) {
      console.error("Invalid JSON:", err);
      return new Response(
        JSON.stringify({ error: "Invalid payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Stripe webhook received:", event.type, "ID:", event.id);

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Helper function to find user by email
    const findUserByEmail = async (email: string) => {
      console.log("Looking for user with email:", email);
      
      // Try exact match first
      let { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id, user_id, email")
        .eq("email", email)
        .single();

      if (error || !data) {
        // Try case-insensitive match
        const { data: allProfiles, error: listError } = await supabaseAdmin
          .from("profiles")
          .select("id, user_id, email");
        
        if (listError) {
          console.error("Error listing profiles:", listError);
          return null;
        }

        // Find case-insensitive match
        const matched = allProfiles?.find(
          p => p.email?.toLowerCase() === email.toLowerCase()
        );

        if (matched) {
          console.log("Found user (case-insensitive):", matched.user_id);
          return matched;
        }

        console.error("User not found for email:", email);
        return null;
      }

      console.log("Found user:", data.user_id);
      return data;
    };

    // Helper function to find user by stripe customer ID
    const findUserByCustomerId = async (customerId: string) => {
      console.log("Looking for user with customer ID:", customerId);
      
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id, user_id, email, stripe_customer_id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (error || !data) {
        console.error("User not found for customer ID:", customerId, error);
        return null;
      }

      console.log("Found user by customer ID:", data.user_id);
      return data;
    };

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("Processing checkout.session.completed:", {
          sessionId: session.id,
          customerEmail: session.customer_email,
          customerId: session.customer,
        });

        const customerEmail = session.customer_email || session.customer_details?.email;
        const customerId = session.customer;

        if (!customerEmail && !customerId) {
          console.error("No customer email or ID in session");
          return new Response(
            JSON.stringify({ error: "No customer info" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Find user
        let userData = null;
        if (customerEmail) {
          userData = await findUserByEmail(customerEmail);
        }
        
        if (!userData && customerId) {
          userData = await findUserByCustomerId(customerId);
        }

        if (!userData) {
          console.error("Could not find user for checkout session");
          // Still return 200 to Stripe to avoid retries, but log the error
          return new Response(
            JSON.stringify({ received: true, warning: "User not found" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Update profile
        console.log("Updating profile for user:", userData.user_id);
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({
            stripe_customer_id: customerId,
            subscription_status: "active",
            subscription_current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userData.user_id);

        if (updateError) {
          console.error("Error updating profile:", updateError);
          return new Response(
            JSON.stringify({ error: "Database update failed" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log("Profile updated successfully");
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        console.log("Processing invoice.payment_succeeded:", {
          invoiceId: invoice.id,
          customerId: invoice.customer,
        });

        const customerId = invoice.customer;
        const periodEnd = invoice.lines?.data?.[0]?.period?.end;

        if (!customerId) {
          console.error("No customer ID in invoice");
          break;
        }

        const userData = await findUserByCustomerId(customerId);

        if (!userData) {
          console.error("User not found for invoice");
          return new Response(
            JSON.stringify({ received: true, warning: "User not found" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "active",
            subscription_current_period_end: periodEnd 
              ? new Date(periodEnd * 1000).toISOString()
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userData.user_id);

        if (updateError) {
          console.error("Error updating subscription:", updateError);
          return new Response(
            JSON.stringify({ error: "Database update failed" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log("Subscription renewed successfully");
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        if (customerId) {
          const userData = await findUserByCustomerId(customerId);
          if (userData) {
            await supabaseAdmin
              .from("profiles")
              .update({
                subscription_status: "past_due",
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", userData.user_id);
            console.log("Subscription marked as past_due");
          }
        }
        break;
      }

      case "customer.subscription.deleted":
      case "customer.subscription.canceled": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        if (customerId) {
          const userData = await findUserByCustomerId(customerId);
          if (userData) {
            await supabaseAdmin
              .from("profiles")
              .update({
                subscription_status: "canceled",
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", userData.user_id);
            console.log("Subscription marked as canceled");
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const status = subscription.status;
        const currentPeriodEnd = subscription.current_period_end;

        if (customerId) {
          const userData = await findUserByCustomerId(customerId);
          if (userData) {
            let subscriptionStatus = "none";
            if (status === "active") subscriptionStatus = "active";
            else if (status === "canceled") subscriptionStatus = "canceled";
            else if (status === "past_due") subscriptionStatus = "past_due";
            else if (status === "trialing") subscriptionStatus = "trialing";
            else if (status === "unpaid") subscriptionStatus = "past_due";

            await supabaseAdmin
              .from("profiles")
              .update({
                subscription_status: subscriptionStatus,
                subscription_current_period_end: currentPeriodEnd 
                  ? new Date(currentPeriodEnd * 1000).toISOString()
                  : null,
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", userData.user_id);
            
            console.log("Subscription updated:", subscriptionStatus);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook handler failed", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
