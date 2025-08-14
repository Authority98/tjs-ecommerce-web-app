-- Update delivery zones with corrected postal codes and pricing
-- Key changes:
-- 1. Jurong Island: 627 -> 629 (629000-629999 range)
-- 2. Sentosa: 098, 099 -> 098 only (098000-098999 range)
-- 3. Reorder zones to prevent overlap (Jurong Island and Sentosa before West)

UPDATE delivery_configurations 
SET zones = '[
  {"id": "central", "name": "Central (CBD)", "postalCodes": ["01", "02", "03", "04", "05", "06"], "fee": 40},
  {"id": "north", "name": "North", "postalCodes": ["72", "73", "75", "76", "77", "78", "79", "80"], "fee": 50},
  {"id": "east", "name": "East", "postalCodes": ["46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57"], "fee": 45},
  {"id": "jurong-island", "name": "Jurong Island", "postalCodes": ["629"], "fee": 120},
  {"id": "sentosa", "name": "Sentosa", "postalCodes": ["098"], "fee": 80},
  {"id": "west", "name": "West", "postalCodes": ["60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71"], "fee": 50}
]'::jsonb
WHERE is_active = true;

-- Verify the update
SELECT 
  id,
  elem->>'name' as zone_name,
  elem->>'postalCodes' as postal_codes,
  elem->>'fee' as fee
FROM delivery_configurations, jsonb_array_elements(zones) AS elem
WHERE is_active = true 
ORDER BY 
  CASE elem->>'name'
    WHEN 'Central (CBD)' THEN 1
    WHEN 'North' THEN 2
    WHEN 'East' THEN 3
    WHEN 'Jurong Island' THEN 4
    WHEN 'Sentosa' THEN 5
    WHEN 'West' THEN 6
    ELSE 7
  END;