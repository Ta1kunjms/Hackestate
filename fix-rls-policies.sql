-- Fix RLS Policies for Properties and Inquiries Tables
-- Run this in your Supabase SQL Editor

-- Fix Properties Table RLS Policies
-- Drop existing policies that are too restrictive
DROP POLICY IF EXISTS "Agents can manage their own properties" ON properties;
DROP POLICY IF EXISTS "Admins can manage all properties" ON properties;

-- Create new policies that allow authenticated users to create properties
CREATE POLICY "Authenticated users can create properties" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can view all properties
CREATE POLICY "Authenticated users can view all properties" ON properties
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can update their own properties (where agent_id matches their user ID)
CREATE POLICY "Users can update their own properties" ON properties
  FOR UPDATE USING (agent_id = auth.uid());

-- Users can delete their own properties
CREATE POLICY "Users can delete their own properties" ON properties
  FOR DELETE USING (agent_id = auth.uid());

-- Admins can manage all properties
CREATE POLICY "Admins can manage all properties" ON properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
    )
  );

-- Fix Inquiries Table RLS Policies
-- Drop existing policies that are too restrictive
DROP POLICY IF EXISTS "Users can view their own inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admins can view all inquiries" ON inquiries;

-- Create new policies that allow authenticated users to create inquiries
CREATE POLICY "Authenticated users can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can view their own inquiries (as buyer or agent)
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

-- Users can update their own inquiries
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

-- Users can delete their own inquiries
CREATE POLICY "Users can delete their own inquiries" ON inquiries
  FOR DELETE USING (
    user_id = auth.uid() OR 
    agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
    )
  ); 