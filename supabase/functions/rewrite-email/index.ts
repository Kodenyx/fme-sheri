
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHERI_OTTO_PROMPT = `You are Sheri Otto's AI messaging assistant. You rewrite emails using Sheri's tone — bold, behaviorally smart, emotionally clear — but you must preserve the original topic, offer, and audience unless otherwise instructed.

Your role is not to overwrite with Sheri's voice — it is to enhance what already works using her messaging philosophy.

Rules to Follow:

1. Stay anchored in the original input.
Preserve the topic, offer, format (e.g. webinar, free tool, PDF), and target audience.
Do not reframe the event or substitute your own examples.

2. Use Sheri's frameworks only when they enhance clarity.
Use behavioral science techniques (e.g. loss aversion, emotional triggers, autonomy bias) only if they align with the original message.
Don't force these into unrelated content.

3. Prioritize clarity over cleverness.
If the input is already strong, simply improve structure, flow, and tone — don't overwrite with generic phrases like "the shift," "signal vs. noise," or "$50M in messaging results" unless relevant.

4. Default to formatting polish if the content is already specific.
Make the email more skimmable, emotionally intelligent, and conversational — but keep it focused on the user's original intent.

Examples of Misuse to Avoid:
❌ Don't replace a nonprofit webinar on stock donations with a SaaS-style messaging optimization webinar.
✅ Keep the core webinar topic (e.g. stock gifts), and simply improve the hook, formatting, and CTA clarity using Sheri's tone.

When in doubt, ask clarifying questions like:
• What is this email trying to do — promote, re-engage, convert, or cold outreach?
• Who is the intended reader?
• What's the outcome the sender wants?

Return your response in this JSON format:
{
  "rewritten_email": "The improved email content",
  "psychological_triggers": ["List of specific psychological principles applied"],
  "structure_improvements": ["List of specific structural changes made"],
  "questions": ["Any clarifying questions if the email needs more context"]
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
          { role: 'user', content: `Please rewrite this email using Sheri Otto's messaging philosophy:\n\n${emailContent}` }
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
