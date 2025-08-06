
-- Set founders program seats to maximum (30) so all seats appear taken
UPDATE subscription_tiers 
SET current_seats = max_seats 
WHERE tier_name = 'founders_program';
