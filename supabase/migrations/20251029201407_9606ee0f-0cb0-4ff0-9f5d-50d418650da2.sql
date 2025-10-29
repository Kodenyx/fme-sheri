-- Allow 0 for lifetime access in promotional_access table
ALTER TABLE promotional_access 
DROP CONSTRAINT IF EXISTS promotional_access_duration_months_check;

-- Add new check constraint that allows 0 or positive values
ALTER TABLE promotional_access 
ADD CONSTRAINT promotional_access_duration_months_check 
CHECK (duration_months >= 0);