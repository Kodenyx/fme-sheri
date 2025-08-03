
-- Add new columns to user_usage_tracking table to support the new credit structure
ALTER TABLE public.user_usage_tracking 
ADD COLUMN IF NOT EXISTS one_time_bonus_claimed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_monthly_claim TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';

-- Update the social_media_credits table to track credit amounts awarded
ALTER TABLE public.social_media_credits 
ADD COLUMN IF NOT EXISTS credit_type TEXT DEFAULT 'one_time';

-- Create an index for better performance on subscription status queries
CREATE INDEX IF NOT EXISTS idx_user_usage_subscription_status 
ON public.user_usage_tracking(subscription_status);

-- Create an index for better performance on bonus claim queries
CREATE INDEX IF NOT EXISTS idx_user_usage_bonus_claimed 
ON public.user_usage_tracking(one_time_bonus_claimed);
