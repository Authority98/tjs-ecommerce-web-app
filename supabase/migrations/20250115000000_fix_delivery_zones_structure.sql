-- Fix delivery zones structure to match frontend expectations
-- Update existing records to use postalCodes instead of postalRanges and add missing id fields

UPDATE delivery_configurations 
SET zones = '[
  {"id": "central", "name": "Central (CBD)", "postalCodes": ["01", "02", "03", "04", "05", "06"], "fee": 40},
  {"id": "north", "name": "North", "postalCodes": ["72", "73", "75", "76", "77", "78", "79", "80"], "fee": 50},
  {"id": "east", "name": "East", "postalCodes": ["46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57"], "fee": 45},
  {"id": "west", "name": "West", "postalCodes": ["60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71"], "fee": 50},
  {"id": "sentosa", "name": "Sentosa", "postalCodes": ["098", "099"], "fee": 80},
  {"id": "jurong-island", "name": "Jurong Island", "postalCodes": ["62"], "fee": 120}
]'::jsonb
WHERE is_active = true;

-- Add comment to document the fix
COMMENT ON TABLE delivery_configurations IS 'Configuration table for zone-based delivery charge calculation - Updated to use postalCodes field structure';