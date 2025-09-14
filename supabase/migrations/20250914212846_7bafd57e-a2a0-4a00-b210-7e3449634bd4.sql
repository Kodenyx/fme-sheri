-- Create unlimited_users table for managing users with unlimited access
CREATE TABLE public.unlimited_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  reason TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.unlimited_users ENABLE ROW LEVEL SECURITY;

-- Create policies for unlimited_users (service role only)
CREATE POLICY "Service can manage unlimited users" 
ON public.unlimited_users 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_unlimited_users_updated_at
BEFORE UPDATE ON public.unlimited_users
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert existing unlimited users from the code
INSERT INTO public.unlimited_users (email, reason) VALUES 
('demo@kodenyx.com', 'Demo account'),
('sheri@sheriotto.com', 'Beta user'),
('aarti.munjal@gmail.com', 'Unlimited access user');