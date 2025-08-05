
-- Reset the founders program current_seats to 0 to make all 30 seats available
UPDATE subscription_tiers 
SET current_seats = 0 
WHERE tier_name = 'founders_program';
