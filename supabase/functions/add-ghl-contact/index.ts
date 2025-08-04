
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADD-GHL-CONTACT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { email, firstName, tagName } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }

    const ghlApiKey = Deno.env.get("GHL_API_KEY");
    const ghlLocationId = Deno.env.get("GHL_LOCATION_ID");

    if (!ghlApiKey || !ghlLocationId) {
      throw new Error("GHL_API_KEY and GHL_LOCATION_ID must be configured");
    }

    logStep("Adding contact to GHL", { email, firstName, tagName });

    // Create or update contact in GHL
    const contactData = {
      email: email,
      locationId: ghlLocationId,
      ...(firstName && { firstName: firstName }),
      ...(tagName && { tags: [tagName] })
    };

    const ghlResponse = await fetch("https://rest.gohighlevel.com/v1/contacts/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ghlApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    const ghlResponseText = await ghlResponse.text();
    logStep("GHL Response", { status: ghlResponse.status, body: ghlResponseText });

    if (!ghlResponse.ok) {
      // If contact already exists, try to update with tags
      if (ghlResponse.status === 422) {
        logStep("Contact exists, attempting to update tags");
        
        // First get the contact to find their ID
        const searchResponse = await fetch(`https://rest.gohighlevel.com/v1/contacts/?email=${encodeURIComponent(email)}&locationId=${ghlLocationId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${ghlApiKey}`,
            "Content-Type": "application/json",
          },
        });

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.contacts && searchData.contacts.length > 0) {
            const contactId = searchData.contacts[0].id;
            
            // Update contact with new tag
            const updateResponse = await fetch(`https://rest.gohighlevel.com/v1/contacts/${contactId}`, {
              method: "PUT",
              headers: {
                "Authorization": `Bearer ${ghlApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...(firstName && { firstName: firstName }),
                ...(tagName && { tags: [tagName] })
              }),
            });

            if (updateResponse.ok) {
              logStep("Successfully updated existing contact");
              return new Response(JSON.stringify({ success: true, action: "updated" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
              });
            }
          }
        }
      }
      
      throw new Error(`GHL API error: ${ghlResponse.status} - ${ghlResponseText}`);
    }

    const ghlData = JSON.parse(ghlResponseText);
    logStep("Successfully added contact to GHL", { contactId: ghlData.contact?.id });

    return new Response(JSON.stringify({ success: true, action: "created", contactId: ghlData.contact?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in add-ghl-contact", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
