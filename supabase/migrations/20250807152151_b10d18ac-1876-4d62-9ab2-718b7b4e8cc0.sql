
-- Reset founder seats to make all spots available again
UPDATE subscription_tiers 
SET current_seats = 0, updated_at = now()
WHERE tier_name = 'founders_program';
