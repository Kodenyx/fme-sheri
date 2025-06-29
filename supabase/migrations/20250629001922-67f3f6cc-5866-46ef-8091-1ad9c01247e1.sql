
-- Create a table to capture email leads from the offer page
CREATE TABLE public.email_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) - making it public since this is for lead capture
ALTER TABLE public.email_leads ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert emails (for lead capture)
CREATE POLICY "Anyone can submit email leads" 
  ON public.email_leads 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that prevents public reading of emails (privacy)
CREATE POLICY "No public access to email leads" 
  ON public.email_leads 
  FOR SELECT 
  USING (false);
