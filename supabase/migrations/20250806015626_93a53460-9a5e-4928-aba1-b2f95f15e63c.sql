
-- Make founders program full by setting current seats to maximum
UPDATE subscription_tiers 
SET current_seats = 30 
WHERE tier_name = 'founders_program';
