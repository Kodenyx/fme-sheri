import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { email } = await req.json();

    console.log('Checking promotional access for:', email);

    if (!email) {
      return new Response(
        JSON.stringify({ hasAccess: false, expiresAt: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const { data, error } = await supabase
      .from('promotional_access')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking promotional access:', error);
      throw error;
    }

    const hasAccess = !!data;
    const expiresAt = data?.expires_at || null;

    console.log('Promotional access result:', { hasAccess, expiresAt });

    return new Response(
      JSON.stringify({ hasAccess, expiresAt }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error checking promotional access:', error);
    return new Response(
      JSON.stringify({ hasAccess: false, expiresAt: null, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
