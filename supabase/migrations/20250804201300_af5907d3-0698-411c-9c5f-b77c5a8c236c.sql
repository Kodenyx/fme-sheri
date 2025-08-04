
-- Set founders program seats to full (30 out of 30)
UPDATE subscription_tiers 
SET current_seats = 30 
WHERE tier_name = 'founders_program';
