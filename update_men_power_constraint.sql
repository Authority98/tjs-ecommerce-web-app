-- =====================================================
-- Update Men Power Constraint (1-20 workers)
-- =====================================================
-- This script updates the men_power constraint to allow 1-20 workers
-- instead of the current 3-20 workers constraint.
-- 
-- Execute this in your Supabase SQL Editor:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Copy and paste this entire script
-- 3. Click "Run" to execute
-- =====================================================

-- Drop the existing constraint (3-20 workers)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_men_power_check;

-- Add the updated constraint (1-20 workers)
ALTER TABLE orders ADD CONSTRAINT orders_men_power_check CHECK (men_power >= 1 AND men_power <= 20);

-- Update the column comment for documentation
COMMENT ON COLUMN orders.men_power IS 'Number of workers selected for installation/teardown services (1-20)';

-- Verify the constraint was updated successfully
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    consrc AS constraint_definition
FROM pg_constraint 
WHERE conname = 'orders_men_power_check';

-- Show success message
SELECT 'men_power constraint successfully updated to allow 1-20 workers' AS status;