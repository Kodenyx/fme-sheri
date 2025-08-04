
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const { email } = await req.json();
    if (!email) throw new Error("Email is required");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "FixMyEmail - Founder's Program",
              description: "Up to 60 email makeovers per month"
            },
            unit_amount: 997, // $9.97
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/tool?subscription=success&email=${encodeURIComponent(email)}`,
      cancel_url: `${req.headers.get("origin")}/tool?subscription=cancelled`,
      metadata: {
        plan: "founders_program",
        monthly_limit: "60",
        user_email: email
      }
    });

    // Add user to GHL as a paid subscriber
    try {
      console.log("Adding paid subscriber to GHL:", email);
      const ghlTagName = Deno.env.get("GHL_PAID_TAG_NAME");
      
      if (ghlTagName) {
        const ghlResponse = await supabaseClient.functions.invoke('add-ghl-contact', {
          body: {
            email: email,
            tagName: ghlTagName
          }
        });

        if (ghlResponse.error) {
          console.error('Failed to add paid subscriber to GHL:', ghlResponse.error);
        } else {
          console.log('Successfully added paid subscriber to GHL');
        }
      }
    } catch (ghlError) {
      console.error('GHL integration error for paid subscriber:', ghlError);
      // Don't fail the checkout if GHL fails
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
