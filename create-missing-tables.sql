-- Create Missing Tables
-- Run this in your Supabase SQL Editor

-- Create inquiries table for property inquiries
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  agent_id UUID REFERENCES profiles(id),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Responded', 'Closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create property_views table for tracking property views
CREATE TABLE IF NOT EXISTS property_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  ip_address INET,
  user_agent TEXT
);

-- Create saved_properties table for user favorites
CREATE TABLE IF NOT EXISTS saved_properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(property_id, user_id)
);

-- Create sales table for tracking property sales
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES profiles(id),
  buyer_id UUID REFERENCES profiles(id),
  sale_price DECIMAL(12,2) NOT NULL,
  sale_date DATE NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 8.5,
  commission_amount DECIMAL(10,2),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create reviews table for property reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  agent_id UUID REFERENCES profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for inquiries
CREATE POLICY "Authenticated users can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view their own inquiries" ON inquiries
  FOR SELECT USING (
    user_id = auth.uid() OR 
    agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
    )
  );

CREATE POLICY "Users can update their own inquiries" ON inquiries
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
    )
  );

-- Create basic RLS policies for other tables
CREATE POLICY "Users can manage their own saved properties" ON saved_properties
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their own property views" ON property_views
  FOR SELECT USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_agent_id ON inquiries(agent_id);
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_user_id ON property_views(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_properties_user_id ON saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_property_id ON sales(property_id);
CREATE INDEX IF NOT EXISTS idx_sales_agent_id ON sales(agent_id);
CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_agent_id ON reviews(agent_id); 