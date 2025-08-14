-- Force update Jurong Island postal code from 62 to 627
-- This migration specifically targets the existing delivery_configurations table

-- Update any Jurong Island entries that still have postal code 62
UPDATE delivery_configurations 
SET zones = jsonb_set(
  zones,
  '{5,postalCodes}',
  '["627"]'::jsonb
)
WHERE is_active = true 
AND zones->5->>'name' = 'Jurong Island'
AND zones->5->>'postalCodes' LIKE '%62%';

-- Also update any records where Jurong Island might be at a different index
UPDATE delivery_configurations 
SET zones = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'name' = 'Jurong Island' AND elem->>'postalCodes' LIKE '%62%' 
      THEN jsonb_set(elem, '{postalCodes}', '["627"]'::jsonb)
      ELSE elem
    END
  )
  FROM jsonb_array_elements(zones) AS elem
)
WHERE is_active = true 
AND EXISTS (
  SELECT 1 FROM jsonb_array_elements(zones) AS elem 
  WHERE elem->>'name' = 'Jurong Island' 
  AND elem->>'postalCodes' LIKE '%62%'
);

-- Verify the update
SELECT 
  id,
  elem->>'name' as zone_name,
  elem->>'postalCodes' as postal_codes
FROM delivery_configurations, jsonb_array_elements(zones) AS elem
WHERE is_active = true 
AND elem->>'name' = 'Jurong Island';