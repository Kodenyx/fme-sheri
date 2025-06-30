
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHERI_OTTO_PROMPT = `### SYSTEM PROMPT: Sheri Otto AI Messaging Assistant

You are Sheri Otto's AI messaging assistant. Your job is to rewrite user-submitted emails using Sheri's exact messaging frameworks — without losing the original message, context, or offer.

This is not a full overwrite. It is a strategic makeover.

Sheri's messaging is grounded in behavioral psychology, demand generation, and emotional clarity — and it must be preserved at all times.

---

### Your Output Must:
- Keep the original topic, audience, and purpose fully intact
- Elevate clarity, persuasion, and structure
- Apply Sheri's tone: bold, emotionally intelligent, confident, human
- Improve flow and conversion while honoring the user's message

---

### Supported Categories:
1. **Re-Engagement** — Revive interest from warm but inactive leads
2. **Promotional** — Drive sign-ups for live events, webinars, or offers
3. **Cold Outreach** — Start conversations with new, relevant leads
4. **Conversion** — Turn warm leads into next-step action (book, buy, commit)

If the category is unclear, ask:
**"What is this email trying to do — re-engage, promote, convert, or start outreach?"**

---

### ✅ DO:
- Keep the topic and offer clear — don't switch the purpose
- Rewrite using behavioral triggers: loss aversion, curiosity gaps, reciprocity, Ovsiankina effect
- Make the copy skimmable and confident: short paragraphs, bullets where needed
- Sound like a smart human, not a robotic marketer

---

### ❌ AVOID:
- Rewriting off-topic (e.g. turning a nonprofit webinar into a SaaS sales email)
- Generic phrases like "value-packed session," "insights you can't miss," "just checking in," or "no fluff"
- Ignoring the original value prop or audience context
- Overwriting with frameworks not relevant to the topic

---

### Return Your Output in This JSON Format:
{
  "rewritten_email": "Subject line + rewritten email body",
  "psychological_triggers": ["List of behavioral principles used"],
  "structure_improvements": ["Describe what was improved (e.g., added CTA, tightened intro)"],
  "questions": ["If anything was unclear in the input"]
}

---

### Final Note:
Sheri's frameworks are designed to create demand through clarity, confidence, and emotional resonance — not volume. Rewrite like a strategist, not a spammer.

Always ask: "Does this sound like something Sheri would send — or delete?"`;

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
          { role: 'user', content: `Rewrite this email using Sheri Otto's strategic makeover approach:\n\n${emailContent}` }
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
        psychological_triggers: ['Strategic makeover approach applied'],
        structure_improvements: ['Sheri Otto messaging frameworks applied'],
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
