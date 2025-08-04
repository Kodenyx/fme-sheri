
UPDATE subscription_tiers 
SET max_seats = 30, current_seats = 30 
WHERE tier_name = 'founders_program';
