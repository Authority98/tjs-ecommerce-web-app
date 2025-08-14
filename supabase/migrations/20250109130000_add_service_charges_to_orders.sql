-- Migration to add installation_charges and teardown_charges columns to orders table

-- Add installation_charges column to orders table
ALTER TABLE orders ADD COLUMN installation_charges numeric DEFAULT 0;

-- Add teardown_charges column to orders table  
ALTER TABLE orders ADD COLUMN teardown_charges numeric DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN orders.installation_charges IS 'Installation service charges for the order';
COMMENT ON COLUMN orders.teardown_charges IS 'Teardown service charges for the order';