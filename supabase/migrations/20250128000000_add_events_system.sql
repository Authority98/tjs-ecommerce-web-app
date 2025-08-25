-- Create events categories table
CREATE TABLE IF NOT EXISTS events_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events services table
CREATE TABLE IF NOT EXISTS events_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES events_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    starting_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    price_type VARCHAR(50) DEFAULT 'starting_from', -- 'starting_from', 'fixed', 'upon_request', 'custom_quotation'
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default events categories
INSERT INTO events_categories (name, description, display_order) VALUES
('Personal Celebrations', 'Birthday parties, baby showers, engagements, weddings, anniversaries and family gatherings', 1),
('Corporate & Commercial', 'Corporate dinners, product launches, festive office décor, and retail installations', 2),
('Festive & Seasonal Décor', 'Christmas décor, lunar new year styling, themed seasonal events', 3),
('Add-On Services', 'Event planning, venue sourcing, entertainment, and logistics management', 4);

-- Insert default services for Personal Celebrations
INSERT INTO events_services (category_id, name, description, starting_price, price_type, display_order)
SELECT 
    id,
    service_name,
    service_description,
    price,
    price_type,
    display_order
FROM events_categories ec
CROSS JOIN (
    VALUES 
        ('Birthday Parties', 'Custom birthday party decorations and setup', 800.00, 'starting_from', 1),
        ('Baby Showers & Gender Reveals', 'Beautiful baby shower and gender reveal decorations', 1200.00, 'starting_from', 2),
        ('Engagements & Weddings', 'Elegant engagement and wedding decoration services', 3500.00, 'starting_from', 3),
        ('Anniversaries & Family Gatherings', 'Special anniversary and family celebration décor', 1000.00, 'starting_from', 4)
) AS services(service_name, service_description, price, price_type, display_order)
WHERE ec.name = 'Personal Celebrations';

-- Insert default services for Corporate & Commercial
INSERT INTO events_services (category_id, name, description, starting_price, price_type, display_order)
SELECT 
    id,
    service_name,
    service_description,
    price,
    price_type,
    display_order
FROM events_categories ec
CROSS JOIN (
    VALUES 
        ('Corporate Dinners & Galas', 'Professional corporate event decorations', 5000.00, 'starting_from', 1),
        ('Product Launches & Brand Activations', 'Brand-focused launch event styling', 4500.00, 'starting_from', 2),
        ('Festive Office Décor', 'Seasonal office decoration services', 2500.00, 'starting_from', 3),
        ('Retail & Mall Installations', 'Large-scale retail decoration projects', 0.00, 'upon_request', 4)
) AS services(service_name, service_description, price, price_type, display_order)
WHERE ec.name = 'Corporate & Commercial';

-- Insert default services for Festive & Seasonal Décor
INSERT INTO events_services (category_id, name, description, starting_price, price_type, display_order)
SELECT 
    id,
    service_name,
    service_description,
    price,
    price_type,
    display_order
FROM events_categories ec
CROSS JOIN (
    VALUES 
        ('Christmas Décor (Office / Mall / Home)', 'Comprehensive Christmas decoration services', 3000.00, 'starting_from', 1),
        ('Lunar New Year / Deepavali / Hari Raya Styling', 'Traditional festival decoration services', 2800.00, 'starting_from', 2),
        ('Themed Seasonal Events', 'Custom themed seasonal event decorations', 0.00, 'upon_request', 3)
) AS services(service_name, service_description, price, price_type, display_order)
WHERE ec.name = 'Festive & Seasonal Décor';

-- Insert default services for Add-On Services
INSERT INTO events_services (category_id, name, description, starting_price, price_type, display_order)
SELECT 
    id,
    service_name,
    service_description,
    price,
    price_type,
    display_order
FROM events_categories ec
CROSS JOIN (
    VALUES 
        ('Event Planning & Coordination', 'Full event planning and coordination services', 1500.00, 'starting_from', 1),
        ('Venue Sourcing & Styling', 'Venue finding and styling services', 0.00, 'upon_request', 2),
        ('Entertainment, Performers & Emcees', 'Entertainment and performance coordination', 0.00, 'upon_request', 3),
        ('Logistics & Project Management', 'Complete event logistics management', 0.00, 'custom_quotation', 4)
) AS services(service_name, service_description, price, price_type, display_order)
WHERE ec.name = 'Add-On Services';

-- Create RLS policies
ALTER TABLE events_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE events_services ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to events_categories" ON events_categories
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to events_services" ON events_services
    FOR SELECT USING (true);

-- Allow authenticated users to manage events (for admin)
CREATE POLICY "Allow authenticated users to manage events_categories" ON events_categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage events_services" ON events_services
    FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_categories_active ON events_categories(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_events_services_category ON events_services(category_id, is_active, display_order);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_categories_updated_at BEFORE UPDATE ON events_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_services_updated_at BEFORE UPDATE ON events_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();