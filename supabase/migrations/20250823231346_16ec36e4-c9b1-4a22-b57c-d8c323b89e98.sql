
-- Give sheri@sheriotto.com unlimited access as a permanent subscriber
INSERT INTO public.subscribers (
  email,
  user_id,
  stripe_customer_id,
  subscribed,
  subscription_tier,
  subscription_end,
  created_at,
  updated_at
) VALUES (
  'sheri@sheriotto.com',
  null,
  null,
  true,
  'Lifetime Access',
  '2099-12-31 23:59:59+00',
  now(),
  now()
)
ON CONFLICT (email) 
DO UPDATE SET
  subscribed = true,
  subscription_tier = 'Lifetime Access',
  subscription_end = '2099-12-31 23:59:59+00',
  updated_at = now();
