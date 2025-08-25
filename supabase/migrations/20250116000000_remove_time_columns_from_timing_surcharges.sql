-- Remove unused time-based columns from timing_surcharges table
-- Since we now only use day-based surcharges, time_start and time_end are no longer needed

-- Remove time_start and time_end columns
ALTER TABLE timing_surcharges 
DROP COLUMN IF EXISTS time_start;

ALTER TABLE timing_surcharges 
DROP COLUMN IF EXISTS time_end;

-- Update the surcharge_type constraint to only allow day_based
ALTER TABLE timing_surcharges 
DROP CONSTRAINT IF EXISTS timing_surcharges_surcharge_type_check;

ALTER TABLE timing_surcharges 
ADD CONSTRAINT timing_surcharges_surcharge_type_check 
CHECK (surcharge_type = 'day_based');

-- Remove any existing time_based surcharges from the database
DELETE FROM timing_surcharges 
WHERE surcharge_type = 'time_based';

-- Add comment to document the change
COMMENT ON TABLE timing_surcharges IS 'Configuration table for day-based timing surcharges only - time-based functionality removed';