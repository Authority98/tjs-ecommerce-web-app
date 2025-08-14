-- Remove distance_config column from delivery_configurations table
-- This migration removes distance-based delivery functionality

-- Update existing configurations to ensure they use zone model
UPDATE delivery_configurations 
SET model = 'zone' 
WHERE model = 'distance';

-- Remove the distance_config column
ALTER TABLE delivery_configurations 
DROP COLUMN IF EXISTS distance_config;

-- Add constraint to ensure only zone model is allowed
ALTER TABLE delivery_configurations 
DROP CONSTRAINT IF EXISTS delivery_configurations_model_check;

ALTER TABLE delivery_configurations 
ADD CONSTRAINT delivery_configurations_model_check 
CHECK (model = 'zone');

-- Ensure default configuration exists with proper zone-based setup
INSERT INTO delivery_configurations (
  model,
  zones,
  add_ons,
  is_active
) VALUES (
  'zone',
  '[
    {"id": "central", "name": "Central (CBD)", "postalCodes": ["01", "02", "03", "04", "05", "06"], "fee": 40},
    {"id": "north", "name": "North", "postalCodes": ["72", "73", "75", "76", "77", "78", "79", "80"], "fee": 50},
    {"id": "east", "name": "East", "postalCodes": ["46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57"], "fee": 45},
    {"id": "west", "name": "West", "postalCodes": ["60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71"], "fee": 50},
    {"id": "sentosa", "name": "Sentosa", "postalCodes": ["098", "099"], "fee": 80},
    {"id": "jurong-island", "name": "Jurong Island", "postalCodes": ["627"], "fee": 120}
  ]'::jsonb,
  '[
    {"id": "no-lift", "name": "No lift access", "fee": 60, "enabled": true},
    {"id": "permits", "name": "Permit/licensing needed", "fee": 80, "enabled": true},
    {"id": "rush-order", "name": "Rush Order", "fee": 150, "enabled": true}
  ]'::jsonb,
  true
) ON CONFLICT (id) DO UPDATE SET
  model = 'zone',
  zones = EXCLUDED.zones,
  add_ons = EXCLUDED.add_ons;

-- Add comment to document the change
COMMENT ON TABLE delivery_configurations IS 'Configuration table for zone-based delivery charge calculation';