-- Update men_power constraint to allow 1-20 workers instead of 3-20
-- This enables the "1-2 workers (included)" option in the frontend

-- Drop the existing constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_men_power_check;

-- Add the updated constraint (1-20 workers instead of 3-20)
ALTER TABLE orders ADD CONSTRAINT orders_men_power_check CHECK (men_power >= 1 AND men_power <= 20);

-- Update comment for documentation
COMMENT ON COLUMN orders.men_power IS 'Number of workers selected for installation/teardown services (1-20)';