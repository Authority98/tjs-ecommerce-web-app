-- Migration to add installation_time and teardown_time columns to orders table

-- Add installation_time column to orders table
ALTER TABLE orders ADD COLUMN installation_time time DEFAULT NULL;

-- Add teardown_time column to orders table  
ALTER TABLE orders ADD COLUMN teardown_time time DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN orders.installation_time IS 'Installation service time for the order';
COMMENT ON COLUMN orders.teardown_time IS 'Teardown service time for the order';