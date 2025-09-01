-- Execute this in Supabase Dashboard SQL Editor
-- Update men_power constraint to allow 1-20 workers

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_men_power_check;
ALTER TABLE orders ADD CONSTRAINT orders_men_power_check CHECK (men_power >= 1 AND men_power <= 20);
COMMENT ON COLUMN orders.men_power IS 'Number of workers selected for installation/teardown services (1-20)';

-- Verify the constraint was updated
SELECT 'Constraint updated successfully - men_power now allows 1-20 workers' AS status;