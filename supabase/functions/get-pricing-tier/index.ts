
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get founders program tier info
    const { data: foundersProgram, error: foundersError } = await supabaseClient
      .from('subscription_tiers')
      .select('*')
      .eq('tier_name', 'founders_program')
      .single();

    if (foundersError) throw foundersError;

    // Get regular program tier info
    const { data: regularProgram, error: regularError } = await supabaseClient
      .from('subscription_tiers')
      .select('*')
      .eq('tier_name', 'regular_program')
      .single();

    if (regularError) throw regularError;

    // Determine current active tier
    const foundersAvailable = foundersProgram.current_seats < foundersProgram.max_seats;
    const currentTier = foundersAvailable ? foundersProgram : regularProgram;

    return new Response(JSON.stringify({
      currentTier: {
        id: currentTier.id,
        name: currentTier.tier_name,
        price_cents: currentTier.price_cents,
        price_display: `$${(currentTier.price_cents / 100).toFixed(2)}`,
        seats_available: foundersAvailable,
        current_seats: foundersProgram.current_seats,
        max_seats: foundersProgram.max_seats
      },
      foundersProgram: {
        seats_remaining: foundersProgram.max_seats - foundersProgram.current_seats,
        is_available: foundersAvailable
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error getting pricing tier:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
