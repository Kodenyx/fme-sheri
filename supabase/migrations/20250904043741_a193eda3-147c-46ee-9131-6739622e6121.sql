-- Add unlimited access for aarti.munjal@gmail.com
INSERT INTO public.user_usage_tracking (
  email,
  subscription_status,
  usage_count,
  bonus_credits,
  one_time_bonus_claimed
) VALUES (
  'aarti.munjal@gmail.com',
  'unlimited',
  0,
  999999,
  true
)
ON CONFLICT (email) 
DO UPDATE SET 
  subscription_status = 'unlimited',
  bonus_credits = 999999,
  one_time_bonus_claimed = true,
  updated_at = now();