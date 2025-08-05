
-- Set founder seats to be filled for testing premium checkout
UPDATE subscription_tiers 
SET current_seats = 30 
WHERE tier_name = 'founders_program';
