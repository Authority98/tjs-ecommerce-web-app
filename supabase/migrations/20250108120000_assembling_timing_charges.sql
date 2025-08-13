-- Create table for assembling/disassembling charges
CREATE TABLE IF NOT EXISTS assembling_charges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type VARCHAR(50) NOT NULL, -- 'assembling' or 'disassembling'
  base_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for timing surcharges
CREATE TABLE IF NOT EXISTS timing_surcharges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  surcharge_type VARCHAR(50) NOT NULL, -- 'time_based' or 'day_based'
  name VARCHAR(100) NOT NULL,
  description TEXT,
  surcharge_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  time_start TIME, -- for time-based surcharges
  time_end TIME, -- for time-based surcharges
  day_types TEXT[], -- for day-based surcharges: ['weekend', 'public_holiday']
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default assembling charges
INSERT INTO assembling_charges (service_type, base_charge, is_active) VALUES
('assembling', 0, true),
('disassembling', 0, true)
ON CONFLICT DO NOTHING;

-- Insert default timing surcharges
INSERT INTO timing_surcharges (surcharge_type, name, description, surcharge_amount, time_start, time_end, day_types, is_active) VALUES
('time_based', 'Evening (6pm-10pm)', 'Evening time surcharge', 80, '18:00:00', '22:00:00', NULL, true),
('time_based', 'Late-night (after 10pm)', 'Late night time surcharge', 150, '22:00:00', '23:59:59', NULL, true),
('day_based', 'Weekend', 'Weekend day surcharge', 100, NULL, NULL, ARRAY['weekend'], true),
('day_based', 'Public Holiday', 'Public holiday surcharge', 180, NULL, NULL, ARRAY['public_holiday'], true)
ON CONFLICT DO NOTHING;

-- Add RLS policies
ALTER TABLE assembling_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE timing_surcharges ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users
CREATE POLICY "Allow read access to assembling_charges" ON assembling_charges FOR SELECT USING (true);
CREATE POLICY "Allow read access to timing_surcharges" ON timing_surcharges FOR SELECT USING (true);

-- Allow admin users to modify (you may need to adjust this based on your auth setup)
CREATE POLICY "Allow admin to modify assembling_charges" ON assembling_charges FOR ALL USING (true);
CREATE POLICY "Allow admin to modify timing_surcharges" ON timing_surcharges FOR ALL USING (true);

-- Add comments
COMMENT ON TABLE assembling_charges IS 'Configuration for assembling and disassembling service charges';
COMMENT ON TABLE timing_surcharges IS 'Configuration for time-based and day-based delivery surcharges';