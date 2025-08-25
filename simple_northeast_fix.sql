-- Simple Northeast Zone Fix - Run this in Supabase SQL Editor
-- This will add Northeast zone to existing delivery configurations

-- Check current zones
SELECT id, jsonb_pretty(zones) as current_zones 
FROM delivery_configurations 
WHERE is_active = true;

-- Add Northeast zone if it doesn't exist
UPDATE delivery_configurations 
SET zones = zones || '[{"id": "northeast", "name": "Northeast", "fee": 45}]'::jsonb
WHERE is_active = true 
AND NOT (zones @> '[{"id": "northeast"}]'::jsonb);

-- If no active configuration exists, create one with all zones including Northeast
INSERT INTO delivery_configurations (model, zones, add_ons, is_active)
SELECT 
  'zone',
  '[
    {"id": "central", "name": "Central (CBD)", "fee": 40},
    {"id": "north", "name": "North", "fee": 50},
    {"id": "northeast", "name": "Northeast", "fee": 45},
    {"id": "east", "name": "East", "fee": 45},
    {"id": "west", "name": "West", "fee": 50},
    {"id": "sentosa", "name": "Sentosa", "fee": 80},
    {"id": "jurong-island", "name": "Jurong Island", "fee": 120}
  ]'::jsonb,
  '[
    {"id": "no-lift", "name": "No lift access", "fee": 60, "enabled": true},
    {"id": "permits", "name": "Permit/licensing needed", "fee": 80, "enabled": true},
    {"id": "rush-order", "name": "Rush Order", "fee": 150, "enabled": true}
  ]'::jsonb,
  true
WHERE NOT EXISTS (SELECT 1 FROM delivery_configurations WHERE is_active = true);

-- Verify the result
SELECT 
  id,
  jsonb_pretty(zones) as zones_with_northeast,
  created_at,
  updated_at
FROM delivery_configurations 
WHERE is_active = true;

-- Force update timestamp to trigger frontend refresh
UPDATE delivery_configurations 
SET updated_at = NOW()
WHERE is_active = true;