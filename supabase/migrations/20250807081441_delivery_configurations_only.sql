-- Create delivery_configurations table
CREATE TABLE IF NOT EXISTS delivery_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model text NOT NULL CHECK (model IN ('zone', 'distance')),
  zones jsonb DEFAULT '[]'::jsonb,
  distance_config jsonb DEFAULT '{}'::jsonb,
  add_ons jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS (Row Level Security)
ALTER TABLE delivery_configurations ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (admin access)
CREATE POLICY "Enable all operations for authenticated users" ON delivery_configurations
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default configuration
INSERT INTO delivery_configurations (
  model,
  zones,
  distance_config,
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
  '{
    "baseFee": 30,
    "baseDistance": 10,
    "additionalRate": 2,
    "maxDistance": 30
  }'::jsonb,
  '[
    {"name": "No lift access", "fee": 60, "enabled": true},
    {"name": "Permit/licensing needed", "fee": 80, "enabled": true},
    {"name": "Specific delivery timing", "fee": 50, "enabled": true}
  ]'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- Add comment to document the table purpose
COMMENT ON TABLE delivery_configurations IS 'Configuration table for delivery charge calculation models';