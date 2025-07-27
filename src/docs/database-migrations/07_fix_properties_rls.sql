-- Migration: Fix properties RLS policies
-- Description: Add policies to allow authenticated users to create properties

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