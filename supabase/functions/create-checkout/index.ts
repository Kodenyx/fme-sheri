
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
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const { email } = await req.json();
    if (!email) throw new Error("Email is required");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Check current pricing tier and availability
    const { data: foundersProgram, error: foundersError } = await supabaseClient
      .from('subscription_tiers')
      .select('*')
      .eq('tier_name', 'founders_program')
      .single();

    if (foundersError) throw foundersError;

    const { data: regularProgram, error: regularError } = await supabaseClient
      .from('subscription_tiers')
      .select('*')
      .eq('tier_name', 'regular_program')
      .single();

    if (regularError) throw regularError;

    // Determine which tier to use
    const foundersAvailable = foundersProgram.current_seats < foundersProgram.max_seats;
    const currentTier = foundersAvailable ? foundersProgram : regularProgram;

    console.log('Current tier selection:', {
      tier: currentTier.tier_name,
      price: currentTier.price_cents,
      foundersSeats: foundersProgram.current_seats,
      foundersMax: foundersProgram.max_seats,
      foundersAvailable
    });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Determine product name and description based on tier
    const productName = foundersAvailable 
      ? "FixMyEmail - Founder's Program" 
      : "FixMyEmail - Premium Plan";
    const productDescription = foundersAvailable 
      ? "Up to 60 email makeovers per month - Founder's pricing!"
      : "Up to 60 email makeovers per month";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: productName,
              description: productDescription
            },
            unit_amount: currentTier.price_cents,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/tool?subscription=success&email=${encodeURIComponent(email)}&tier=${currentTier.tier_name}`,
      cancel_url: `${req.headers.get("origin")}/tool?subscription=cancelled`,
      metadata: {
        plan: currentTier.tier_name,
        monthly_limit: "60",
        user_email: email,
        tier_id: currentTier.id
      }
    });

    // Reserve a seat if it's founders program (we'll confirm it in webhook/success)
    if (foundersAvailable) {
      const { error: updateError } = await supabaseClient
        .from('subscription_tiers')
        .update({ current_seats: foundersProgram.current_seats + 1 })
        .eq('id', foundersProgram.id);

      if (updateError) {
        console.error('Error reserving founders seat:', updateError);
        // Continue with checkout anyway, but log the error
      } else {
        console.log('Reserved founders seat, new count:', foundersProgram.current_seats + 1);
      }
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
