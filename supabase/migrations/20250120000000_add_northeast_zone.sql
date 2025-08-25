-- Add Northeast zone to delivery_configurations
-- This migration adds the missing Northeast zone that appears in ZoneSelector but not in admin

UPDATE delivery_configurations 
SET zones = (
  SELECT jsonb_agg(
    CASE 
      WHEN zone->>'id' = 'east' THEN 
        jsonb_build_object(
          'id', 'northeast',
          'name', 'Northeast',
          'fee', 45
        )
      ELSE zone
    END
  ) || jsonb_build_object(
    'id', 'east',
    'name', 'East', 
    'fee', 45
  )
  FROM jsonb_array_elements(zones) AS zone
  WHERE zone->>'id' != 'northeast'
)
WHERE zones IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM jsonb_array_elements(zones) AS zone 
  WHERE zone->>'id' = 'northeast'
);

-- Alternative approach: Direct insertion if the above doesn't work
UPDATE delivery_configurations
SET zones = zones || '[{"id": "northeast", "name": "Northeast", "fee": 45}]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM jsonb_array_elements(zones) AS zone 
  WHERE zone->>'id' = 'northeast'
);

COMMENT ON TABLE delivery_configurations IS 'Configuration table for zone-based delivery charge calculation - Northeast zone added to match ZoneSelector options';