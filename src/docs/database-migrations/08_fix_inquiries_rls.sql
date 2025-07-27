-- Migration: Fix inquiries RLS policies
-- Description: Add policies to allow authenticated users to create inquiries

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