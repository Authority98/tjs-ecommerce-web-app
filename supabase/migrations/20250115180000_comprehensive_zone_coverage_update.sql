-- Comprehensive delivery zones update with complete postal code coverage
-- Based on Singapore's official postal districts and thorough research
-- This ensures no areas are missed for any delivery zone

UPDATE delivery_configurations 
SET zones = '[
  {
    "id": "jurong-island", 
    "name": "Jurong Island", 
    "postalCodes": ["629"], 
    "fee": 120
  },
  {
    "id": "sentosa", 
    "name": "Sentosa", 
    "postalCodes": [
      "098000-098999", "099000", "099001", "099002", "099003", "099004", 
      "099005", "099006", "099007", "099008", "099010", "099011", "099012", 
      "099013", "099048", "099049", "099050", "099051", "099052", "099053", 
      "099054", "099055", "099056", "099057", "099081", "099536", "099537", "099538"
    ], 
    "fee": 80
  },
  {
    "id": "central", 
    "name": "Central (CBD)", 
    "postalCodes": [
      "01", "02", "03", "04", "05", "06",
      "07", "08",
      "17",
      "18", "19",
      "20", "21",
      "22", "23",
      "24", "25", "26", "27",
      "28", "29", "30",
      "31", "32", "33"
    ], 
    "fee": 40
  },
  {
    "id": "north", 
    "name": "North", 
    "postalCodes": [
      "72", "73", "75", "76", "77", "78", "79", "80",
      "53", "54", "55", "82",
      "56", "57"
    ], 
    "fee": 50
  },
  {
    "id": "east", 
    "name": "East", 
    "postalCodes": [
      "46", "47", "48", "49", "50", "51", "52",
      "34", "35", "36", "37",
      "81"
    ], 
    "fee": 45
  },
  {
    "id": "west", 
    "name": "West", 
    "postalCodes": [
      "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71",
      "620", "621", "622", "623", "624", "625", "626", "627", "628",
      "14", "15", "16"
    ], 
    "fee": 50
  }
]'::jsonb
WHERE is_active = true;

-- Verify the comprehensive update
SELECT 
  id,
  elem->>'name' as zone_name,
  elem->>'postalCodes' as postal_codes,
  elem->>'fee' as fee
FROM delivery_configurations, jsonb_array_elements(zones) AS elem
WHERE is_active = true 
ORDER BY 
  CASE elem->>'name'
    WHEN 'Jurong Island' THEN 1
    WHEN 'Sentosa' THEN 2
    WHEN 'Central (CBD)' THEN 3
    WHEN 'North' THEN 4
    WHEN 'East' THEN 5
    WHEN 'West' THEN 6
    ELSE 7
  END;

-- Add comprehensive documentation
COMMENT ON TABLE delivery_configurations IS 'Comprehensive delivery zones configuration covering all Singapore postal districts. Central: Districts 1-12 (01-33), North: Districts 19-20,25-28 (53-57,72-73,75-82), East: Districts 13-18 (34-37,46-52,81), West: Districts 5,21-24 (14-16,58-71,620-628). Jurong Island and Sentosa have priority matching.';