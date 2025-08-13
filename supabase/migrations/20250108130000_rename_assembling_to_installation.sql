-- Migration to rename assembling_charges table to installation_charges
-- and update service types from assembling/disassembling to installation/teardown

-- Create new installation_charges table
CREATE TABLE installation_charges (
  id BIGSERIAL PRIMARY KEY,
  service_type TEXT NOT NULL CHECK (service_type IN ('installation', 'teardown')),
  base_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Copy data from assembling_charges to installation_charges with updated service types
INSERT INTO installation_charges (service_type, base_charge, is_active, created_at, updated_at)
SELECT 
  CASE 
    WHEN service_type = 'assembling' THEN 'installation'
    WHEN service_type = 'disassembling' THEN 'teardown'
    ELSE service_type
  END as service_type,
  base_charge,
  is_active,
  created_at,
  updated_at
FROM assembling_charges;

-- Enable RLS on installation_charges
ALTER TABLE installation_charges ENABLE ROW LEVEL SECURITY;

-- Create policies for installation_charges (same as assembling_charges)
CREATE POLICY "Allow read access for all users" ON installation_charges
  FOR SELECT USING (true);

CREATE POLICY "Allow full access for admins" ON installation_charges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@tjschristmastrees.com'
    )
  );

-- Drop the old assembling_charges table
DROP TABLE IF EXISTS assembling_charges;

-- Update any existing orders table references if they exist
-- Note: This assumes orders table has assembling_charges and disassembling_charges columns
-- Uncomment and modify if your orders table structure is different

-- ALTER TABLE orders RENAME COLUMN assembling_charges TO installation_charges;
-- ALTER TABLE orders RENAME COLUMN disassembling_charges TO teardown_charges;