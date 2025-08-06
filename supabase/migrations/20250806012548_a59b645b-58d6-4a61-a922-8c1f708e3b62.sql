
-- Reset founders program to have all 30 seats available
UPDATE subscription_tiers 
SET current_seats = 0 
WHERE tier_name = 'founders_program';
