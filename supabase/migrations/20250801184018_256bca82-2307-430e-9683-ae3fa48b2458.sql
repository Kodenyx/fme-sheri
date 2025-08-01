
-- Create a table to track social media submissions and credits
CREATE TABLE public.social_media_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  email TEXT NOT NULL,
  image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  credits_awarded INTEGER NOT NULL DEFAULT 0,
  submission_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.social_media_credits ENABLE ROW LEVEL SECURITY;

-- Users can insert their own submissions
CREATE POLICY "Users can create their own submissions" 
  ON public.social_media_credits 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR auth.email() = email);

-- Users can view their own submissions
CREATE POLICY "Users can view their own submissions" 
  ON public.social_media_credits 
  FOR SELECT 
  USING (auth.uid() = user_id OR auth.email() = email);

-- Allow service updates for admin approval
CREATE POLICY "Allow service updates" 
  ON public.social_media_credits 
  FOR ALL 
  USING (true);

-- Add a column to track bonus credits in user_usage_tracking
ALTER TABLE public.user_usage_tracking 
ADD COLUMN bonus_credits INTEGER NOT NULL DEFAULT 0;

-- Create trigger for updated_at
CREATE TRIGGER update_social_media_credits_updated_at
  BEFORE UPDATE ON public.social_media_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
