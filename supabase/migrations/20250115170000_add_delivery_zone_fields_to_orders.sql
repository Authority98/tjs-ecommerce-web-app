-- Add delivery zone fields to orders table for zone-based delivery selection
-- This migration adds fields to store the selected delivery zone, area, and fee
-- from the new ZoneSelector component

ALTER TABLE orders 
ADD COLUMN delivery_zone TEXT,
ADD COLUMN delivery_area TEXT,
ADD COLUMN delivery_fee DECIMAL(10,2) DEFAULT 0;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_delivery_zone ON orders(delivery_zone);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_area ON orders(delivery_area);

-- Add comment to document the new fields
COMMENT ON COLUMN orders.delivery_zone IS 'Selected delivery zone (central, north, east, west, jurong-island, sentosa)';
COMMENT ON COLUMN orders.delivery_area IS 'Selected delivery area within the zone';
COMMENT ON COLUMN orders.delivery_fee IS 'Calculated delivery fee based on selected zone';

-- Update table comment to reflect zone-based delivery
COMMENT ON TABLE orders IS 'Customer orders with zone-based delivery selection and fee calculation';