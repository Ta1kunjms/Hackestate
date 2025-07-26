-- Migration: Create user roles table
-- Description: Creates the user_roles table with predefined role types for the real estate application

-- Create user_roles table
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert predefined roles
INSERT INTO user_roles (name, description, permissions) VALUES
  ('admin', 'System administrator with full access to all features and user management', 
   '{"can_manage_users": true, "can_approve_agents": true, "can_approve_developers": true, "can_view_analytics": true, "can_manage_system": true}'),
  
  ('agent', 'Real estate agent with access to listing management and client interactions', 
   '{"can_create_listings": true, "can_manage_listings": true, "can_view_analytics": true, "can_contact_clients": true, "can_manage_inquiries": true}'),
  
  ('developer', 'Property developer with access to project management and lead tracking', 
   '{"can_create_projects": true, "can_manage_projects": true, "can_view_analytics": true, "can_manage_leads": true, "can_upload_documents": true}'),
  
  ('seller', 'Property seller with access to property management and offer review', 
   '{"can_list_properties": true, "can_manage_properties": true, "can_review_offers": true, "can_view_analytics": true, "can_upload_photos": true}'),
  
  ('buyer', 'Property buyer with access to property search and favorites', 
   '{"can_search_properties": true, "can_save_favorites": true, "can_make_offers": true, "can_view_listings": true, "can_contact_agents": true}');

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles table
-- Admins can read all roles
CREATE POLICY "Admins can view all roles" ON user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
    )
  );

-- All authenticated users can read active roles
CREATE POLICY "Users can view active roles" ON user_roles
  FOR SELECT USING (is_active = true);

-- Only admins can insert/update/delete roles
CREATE POLICY "Only admins can manage roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
    )
  );

-- Create updated_at trigger for user_roles
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add role_id column to existing profiles table
ALTER TABLE profiles ADD COLUMN role_id UUID REFERENCES user_roles(id);

-- Set default role for existing users (buyer)
UPDATE profiles 
SET role_id = (SELECT id FROM user_roles WHERE name = 'buyer')
WHERE role_id IS NULL;

-- Make role_id NOT NULL after setting defaults
ALTER TABLE profiles ALTER COLUMN role_id SET NOT NULL;

-- Create index for better performance
CREATE INDEX idx_profiles_role_id ON profiles(role_id);
CREATE INDEX idx_user_roles_name ON user_roles(name); 