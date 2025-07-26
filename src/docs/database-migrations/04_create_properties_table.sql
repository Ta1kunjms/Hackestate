-- Migration: Create properties table
-- Description: Creates the properties table for managing real estate listings

-- Create properties table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'Philippines',
  price DECIMAL(12,2) NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('House', 'Condo', 'Apartment', 'Townhouse', 'Land', 'Commercial', 'Other')),
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Sold', 'Under Contract', 'Off Market')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqm DECIMAL(10,2),
  lot_area_sqm DECIMAL(10,2),
  year_built INTEGER,
  agent_id UUID REFERENCES profiles(id),
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policies for properties table
-- Everyone can view available properties
CREATE POLICY "Anyone can view available properties" ON properties
  FOR SELECT USING (status = 'Available');

-- Authenticated users can view all properties
CREATE POLICY "Authenticated users can view all properties" ON properties
  FOR SELECT USING (auth.role() = 'authenticated');

-- Agents can manage their own properties
CREATE POLICY "Agents can manage their own properties" ON properties
  FOR ALL USING (
    agent_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role_id IN (SELECT id FROM user_roles WHERE name = 'agent')
    )
  );

-- Admins can manage all properties
CREATE POLICY "Admins can manage all properties" ON properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
    )
  );

-- Create updated_at trigger for properties
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_agent_id ON properties(agent_id); 