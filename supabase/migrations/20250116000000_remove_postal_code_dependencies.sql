-- ========================================
-- REMOVE POSTAL CODE DEPENDENCIES MIGRATION
-- ========================================
-- This script removes postal code dependencies from the database
-- to support pure zone-based delivery fee calculation

-- Step 1: Remove postal_code column from orders table
ALTER TABLE orders 
DROP COLUMN IF EXISTS postal_code;

-- Step 2: Update delivery_configurations to remove postalCodes from zones
-- Simplify zones to only include id, name, and fee
UPDATE delivery_configurations 
SET zones = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', zone->>'id',
      'name', zone->>'name', 
      'fee', (zone->>'fee')::integer
    )
  )
  FROM jsonb_array_elements(zones) AS zone
)
WHERE zones IS NOT NULL;

-- Step 3: Add comment to document the change
COMMENT ON TABLE delivery_configurations IS 'Configuration table for pure zone-based delivery charge calculation - postal code dependencies removed';

-- Step 4: Verify the changes
-- You can run this query to check the updated structure:
-- SELECT id, model, zones, is_active FROM delivery_configurations;