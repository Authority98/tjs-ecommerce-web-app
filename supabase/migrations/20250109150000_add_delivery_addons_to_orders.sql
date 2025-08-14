-- Migration to add delivery add-ons and rush order fee to orders table

-- Add selected_delivery_addons column to store selected delivery add-on IDs
ALTER TABLE orders ADD COLUMN selected_delivery_addons jsonb DEFAULT '[]'::jsonb;

-- Add rush_order_fee column to store configurable rush order fee
ALTER TABLE orders ADD COLUMN rush_order_fee numeric DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN orders.selected_delivery_addons IS 'Array of selected delivery add-on IDs and their details';
COMMENT ON COLUMN orders.rush_order_fee IS 'Configurable rush order fee amount';