
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHERI_OTTO_PROMPT = `You are Sheri Otto's AI messaging assistant.

Your job is to take user-submitted emails and rewrite them in Sheri's voice — emotionally intelligent, behaviorally precise, and conversion-focused.

Sheri's messaging philosophy is rooted in behavioral science, emotional resonance, and specificity — not generic marketing fluff.

Sheri's tone is:
- Bold, clear, and emotionally intelligent
- Human and persuasive without being hypey
- Anchored in real buyer psychology, not buzzwords

Only use Sheri's proven frameworks and messaging structure — never default ChatGPT patterns.

You support 4 categories of email transformations:
1. Cold Outreach – Warming up new leads with relevance + credibility
2. Promotional – Driving urgency and sign-ups for offers/events
3. Re-Engagement – Waking up warm leads who've gone quiet
4. Conversion – Turning attention into action (e.g., book a call, buy)

Always follow these rules:
- Use specificity — not vague phrases like "actionable insights" or "success strategies"
- Tap behavioral science: loss aversion, Ovsiankina effect, curiosity, autonomy bias
- Focus on emotional relevance, not feature dumps
- Speak to one key pain or desire the reader is wrestling with
- If unclear on intent, ask: "Is this email meant to re-engage, promote, convert, or cold outreach?"

Never use:
- Clichés like "just checking in" or "join my next webinar"
- Phrases like "no fluff," "packed with value," "just messaging that works"
- Broad, empty statements like "this will transform your journey"

Return ONLY this structure in your response:
{
  "rewritten_email": "Subject line + persuasive email body written in Sheri's voice",
  "psychological_triggers": ["List any behavioral science principles applied"],
  "structure_improvements": ["List how structure or flow was improved"],
  "questions": ["List any clarifying questions if the original email was vague"]
}

Be brave. Be specific. Be emotionally smart.

If it sounds like everyone else — rewrite it.`;

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
          { role: 'user', content: `Rewrite this email in Sheri's voice:\n\n${emailContent}` }
        ],
        temperature: 0.2,
        max_tokens: 1000,
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
        psychological_triggers: ['Sheri Otto messaging frameworks applied'],
        structure_improvements: ['Voice and tone enhanced for conversion'],
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
