
-- Reset founders program seats to 0 (making it available again)
UPDATE subscription_tiers 
SET current_seats = 0 
WHERE tier_name = 'founders_program';
