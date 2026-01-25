import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SUPABASE_API_URL = "https://api.supabase.com";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const accessToken = Deno.env.get("SUPABASE_ACCESS_TOKEN");
    const projectRef = "vbaaohcsmiaxbqcyfhhl";
    const siteUrl = "https://medannotv2.vercel.app";
    const redirectUrl = `${siteUrl}/auth/callback`;

    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "Missing SUPABASE_ACCESS_TOKEN" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update auth config via Supabase Management API
    const response = await fetch(
      `${SUPABASE_API_URL}/v1/projects/${projectRef}/auth/config`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          site_url: siteUrl,
          redirect_urls: [redirectUrl, `${siteUrl}/checkout`, siteUrl],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Supabase API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update Supabase config", details: error }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await response.json();
    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
