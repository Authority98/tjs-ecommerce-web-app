-- Migration to add men_power column to orders table
-- This stores the number of workers selected for installation/teardown services

-- Add men_power column to orders table
ALTER TABLE orders ADD COLUMN men_power integer DEFAULT 3;

-- Add constraint to ensure reasonable values (3-20 workers)
ALTER TABLE orders ADD CONSTRAINT orders_men_power_check CHECK (men_power >= 3 AND men_power <= 20);

-- Add comment for documentation
COMMENT ON COLUMN orders.men_power IS 'Number of workers selected for installation/teardown services (3-20)';