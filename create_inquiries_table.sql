-- Create inquiries table for storing event service inquiries
CREATE TABLE IF NOT EXISTS public.inquiries (
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
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_service_name ON public.inquiries(service_name);

-- Enable RLS (Row Level Security)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow authenticated users to view inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow authenticated users to update inquiries" ON public.inquiries;

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