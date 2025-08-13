-- ========================================
-- REMOVE SPECIFIC DELIVERY TIMING ADD-ON
-- ========================================
-- This script removes the "Specific delivery timing" add-on from delivery configurations

-- Update delivery_configurations to remove "Specific delivery timing" add-on
UPDATE delivery_configurations 
SET add_ons = (
  SELECT jsonb_agg(addon)
  FROM jsonb_array_elements(add_ons) AS addon
  WHERE addon->>'name' != 'Specific delivery timing'
)
WHERE add_ons IS NOT NULL;

-- Add comment to document the change
COMMENT ON TABLE delivery_configurations IS 'Configuration table for delivery charge calculation models - Updated to remove Specific delivery timing add-on';