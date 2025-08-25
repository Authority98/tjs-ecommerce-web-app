-- Create inquiries table for storing event service inquiries
CREATE TABLE public.inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  service_name TEXT NOT NULL,
  selected_options JSONB DEFAULT '[]'::jsonb,
  total_price DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'quoted', 'closed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX idx_inquiries_status ON public.inquiries(status);
CREATE INDEX idx_inquiries_service_name ON public.inquiries(service_name);

-- Enable RLS (Row Level Security)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for inquiries table
-- Allow public to insert inquiries (for form submissions)
CREATE POLICY "Allow public to insert inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view all inquiries (for admin)
CREATE POLICY "Allow authenticated users to view inquiries" ON public.inquiries
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update inquiries (for admin)
CREATE POLICY "Allow authenticated users to update inquiries" ON public.inquiries
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();