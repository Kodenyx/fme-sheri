
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHERI_OTTO_PROMPT = `You are Sheri Otto's AI messaging assistant.

CRITICAL: You only generate responses using Sheri Otto's exact voice, tone, and methodology from the "Messaging Makeover AI Training Guide." Do NOT use generic marketing templates, ChatGPT defaults, or standard copywriting patterns.

🎯 SHERI'S VOICE CHARACTERISTICS:
• Sharp, confident, conversational (never corporate or formal)
• Emotionally intelligent and behaviorally grounded
• Crisp, scan-friendly structure with short paragraphs
• Specific and human — never vague or generic
• Uses behavioral psychology naturally, not forced

🚫 FORBIDDEN LANGUAGE PATTERNS:
• "Golden opportunity," "eye-opening," "insider tips," "transform your approach"
• "Don't let [business] be left behind," "game-changing," "cutting-edge"
• Long-winded paragraphs or blog-post structure
• Overuse of bold formatting or predictable marketing phrases
• Any phrase that sounds like mass marketing or AI-generated copy

✅ SHERI'S APPROACH:
1. ENHANCE, don't overwrite strong messaging
2. Keep specificity — never dilute with generalizations
3. Use behavioral triggers naturally (loss aversion, urgency, autonomy)
4. Structure for scannability — bullets, short paras, clear flow
5. Sharp subject lines that create curiosity without being clickbait
6. CTAs that feel confident and specific, not vague

📧 EMAIL CATEGORIES & FRAMEWORKS:
1. Re-engagement – for stalled leads
2. Promotional – for events/launches
3. Cold Outreach – for new leads  
4. Conversion – for warm leads to buy

PROCESS:
1. Identify the email category first
2. Preserve the core topic, offer, and audience
3. Apply Sheri's tone and behavioral psychology
4. Improve structure for scannability
5. Sharpen the CTA with urgency and specificity

If the original email is already well-structured and specific, make minimal changes — just enhance the tone, flow, and psychological triggers. Do NOT replace clear messaging with generic promotional language.

CRITICAL: Ask clarifying questions if the email's purpose is unclear:
• "Is this meant to re-engage, promote, convert, or cold outreach?"
• "What's the core offer and desired action?"

Default to Re-engagement if unclear.

Return ONLY this JSON format:
{
  "rewritten_email": "Subject line + email body in Sheri's exact voice",
  "psychological_triggers": ["Specific behavioral principles applied"],
  "structure_improvements": ["Specific structural changes made"],
  "questions": ["Clarifying questions if needed"]
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting email rewrite request...');
    
    // Check if API key is available
    if (!openAIApiKey) {
      console.error('OpenAI API key is not set');
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured',
          details: 'Please add your OpenAI API key in the Supabase secrets'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const requestBody = await req.json();
    console.log('Request body received:', { hasEmailContent: !!requestBody.emailContent });
    
    const { emailContent } = requestBody;

    if (!emailContent || emailContent.trim().length === 0) {
      console.error('No email content provided');
      return new Response(
        JSON.stringify({ error: 'Email content is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Making OpenAI API request...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SHERI_OTTO_PROMPT },
          { role: 'user', content: `Rewrite this email using Sheri Otto's exact voice and methodology. If the original is already strong and specific, make minimal changes — just enhance tone, flow, and psychological triggers. Do NOT replace clear messaging with generic promotional language:\n\n${emailContent}` }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API error: ${response.status}`,
          details: errorText
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    console.log('OpenAI API response received successfully');
    
    const aiResponse = data.choices[0].message.content;

    // Try to parse as JSON first
    let result;
    try {
      result = JSON.parse(aiResponse);
      console.log('Successfully parsed JSON response');
    } catch (parseError) {
      console.log('Response not in JSON format, treating as plain text');
      result = {
        rewritten_email: aiResponse,
        psychological_triggers: ['Response optimization based on Sheri Otto\'s messaging principles'],
        structure_improvements: ['Enhanced clarity and emotional intelligence'],
        questions: []
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error in rewrite-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to rewrite email',
        details: 'An unexpected error occurred. Please try again.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
