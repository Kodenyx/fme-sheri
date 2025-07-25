
-- Create user_usage_tracking table to track usage counts
CREATE TABLE public.user_usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index on email for efficient lookups
CREATE UNIQUE INDEX idx_user_usage_tracking_email ON public.user_usage_tracking(email);

-- Enable Row Level Security
ALTER TABLE public.user_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for user_usage_tracking
CREATE POLICY "Users can view their own usage data" ON public.user_usage_tracking
FOR SELECT
USING (auth.uid() = user_id OR auth.email() = email);

CREATE POLICY "Users can update their own usage data" ON public.user_usage_tracking
FOR UPDATE
USING (auth.uid() = user_id OR auth.email() = email);

CREATE POLICY "Users can insert their own usage data" ON public.user_usage_tracking
FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.email() = email);

CREATE POLICY "Allow anonymous usage tracking" ON public.user_usage_tracking
FOR ALL
USING (true);

-- Create subscribers table for Stripe subscription tracking
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers
CREATE POLICY "Users can view their own subscription" ON public.subscribers
FOR SELECT
USING (auth.uid() = user_id OR auth.email() = email);

CREATE POLICY "Users can update their own subscription" ON public.subscribers
FOR UPDATE
USING (auth.uid() = user_id OR auth.email() = email);

CREATE POLICY "Users can insert their own subscription" ON public.subscribers
FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.email() = email);

CREATE POLICY "Allow service updates" ON public.subscribers
FOR ALL
USING (true);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_usage_tracking_updated_at
  BEFORE UPDATE ON public.user_usage_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
