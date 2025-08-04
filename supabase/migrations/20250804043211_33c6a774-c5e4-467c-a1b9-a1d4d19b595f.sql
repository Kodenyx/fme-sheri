
-- Create a table to track subscription tiers and available seats
CREATE TABLE public.subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name TEXT NOT NULL UNIQUE,
  price_cents INTEGER NOT NULL,
  max_seats INTEGER,
  current_seats INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert the two tiers
INSERT INTO public.subscription_tiers (tier_name, price_cents, max_seats, current_seats, is_active) VALUES
('founders_program', 997, 30, 0, true),
('regular_program', 1997, NULL, 0, true);

-- Enable RLS
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (to check pricing)
CREATE POLICY "Anyone can view subscription tiers" 
  ON public.subscription_tiers 
  FOR SELECT 
  USING (true);

-- Create policy for service updates
CREATE POLICY "Service can update subscription tiers" 
  ON public.subscription_tiers 
  FOR UPDATE 
  USING (true);

-- Add trigger to update the updated_at column
CREATE TRIGGER update_subscription_tiers_updated_at
  BEFORE UPDATE ON public.subscription_tiers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Update subscribers table to include tier information
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS subscription_tier_id UUID REFERENCES public.subscription_tiers(id);
