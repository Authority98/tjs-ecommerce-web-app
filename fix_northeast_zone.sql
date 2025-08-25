-- Fix Northeast Zone Issue - Comprehensive Database Update
-- This script adds the Northeast zone to delivery_configurations and ensures proper data structure

-- First, let's check current delivery configurations
SELECT id, model, zones, add_ons, is_active, created_at 
FROM delivery_configurations 
WHERE is_active = true 
ORDER BY created_at DESC;

-- Update existing active delivery configurations to include Northeast zone
UPDATE delivery_configurations 
SET zones = jsonb_set(
  COALESCE(zones, '[]'::jsonb),
  '{999}',
  '{"id": "northeast", "name": "Northeast", "fee": 45, "postalCodes": ["54", "55", "82", "83"]}'
)
WHERE is_active = true 
AND NOT EXISTS (
  SELECT 1 FROM jsonb_array_elements(zones) AS zone 
  WHERE zone->>'id' = 'northeast'
);

-- If no active configuration exists, insert a complete default configuration
INSERT INTO delivery_configurations (
  model,
  zones,
  add_ons,
  is_active
)
SELECT 
  'zone',
  '[
    {"id": "central", "name": "Central (CBD)", "fee": 40, "postalCodes": ["01", "02", "03", "04", "05", "06"]},
    {"id": "north", "name": "North", "fee": 50, "postalCodes": ["72", "73", "75", "76", "77", "78", "79", "80"]},
    {"id": "northeast", "name": "Northeast", "fee": 45, "postalCodes": ["54", "55", "82", "83"]},
    {"id": "east", "name": "East", "fee": 45, "postalCodes": ["46", "47", "48", "49", "50", "51", "52", "53", "56", "57"]},
    {"id": "west", "name": "West", "fee": 50, "postalCodes": ["60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71"]},
    {"id": "sentosa", "name": "Sentosa", "fee": 80, "postalCodes": ["098", "099"]},
    {"id": "jurong-island", "name": "Jurong Island", "fee": 120, "postalCodes": ["627"]}
  ]'::jsonb,
  '[
    {"id": "no-lift", "name": "No lift access", "fee": 60, "enabled": true},
    {"id": "permits", "name": "Permit/licensing needed", "fee": 80, "enabled": true},
    {"id": "rush-order", "name": "Rush Order", "fee": 150, "enabled": true}
  ]'::jsonb,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM delivery_configurations WHERE is_active = true
);

-- Verify the update
SELECT 
  id,
  model,
  jsonb_pretty(zones) as zones_formatted,
  jsonb_pretty(add_ons) as addons_formatted,
  is_active,
  created_at,
  updated_at
FROM delivery_configurations 
WHERE is_active = true 
ORDER BY created_at DESC;

-- Check if Northeast zone exists in the zones
SELECT 
  id,
  zone->>'name' as zone_name,
  zone->>'fee' as zone_fee
FROM delivery_configurations,
     jsonb_array_elements(zones) AS zone
WHERE is_active = true
AND zone->>'id' = 'northeast';

-- Update the updated_at timestamp to trigger frontend refresh
UPDATE delivery_configurations 
SET updated_at = NOW()
WHERE is_active = true;