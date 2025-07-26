-- Migration: Create role approvals table
-- Description: Creates the role_approvals table for managing agent and developer approval workflows

-- Create role_approvals table
CREATE TABLE role_approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role_name TEXT NOT NULL CHECK (role_name IN ('agent', 'developer')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  documentation_url TEXT,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE role_approvals ENABLE ROW LEVEL SECURITY;

-- Create policies for role_approvals table

-- Users can view their own approval requests
CREATE POLICY "Users can view own approval requests" ON role_approvals
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own approval requests
CREATE POLICY "Users can create own approval requests" ON role_approvals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending approval requests
CREATE POLICY "Users can update own pending requests" ON role_approvals
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND status = 'pending'
  );

-- Admins can view all approval requests
CREATE POLICY "Admins can view all approval requests" ON role_approvals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
    )
  );

-- Admins can update all approval requests
CREATE POLICY "Admins can update all approval requests" ON role_approvals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role_id IN (SELECT id FROM user_roles WHERE name = 'admin')
    )
  );

-- Create updated_at trigger for role_approvals
CREATE TRIGGER update_role_approvals_updated_at
    BEFORE UPDATE ON role_approvals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_role_approvals_user_id ON role_approvals(user_id);
CREATE INDEX idx_role_approvals_status ON role_approvals(status);
CREATE INDEX idx_role_approvals_role_name ON role_approvals(role_name);
CREATE INDEX idx_role_approvals_reviewed_by ON role_approvals(reviewed_by);

-- Create function to handle approval status changes
CREATE OR REPLACE FUNCTION handle_role_approval_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed to approved, update user's role
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Get the role_id for the approved role
    UPDATE profiles 
    SET role_id = (SELECT id FROM user_roles WHERE name = NEW.role_name)
    WHERE id = NEW.user_id;
    
    -- Set reviewed_at timestamp
    NEW.reviewed_at = TIMEZONE('utc'::text, NOW());
  END IF;
  
  -- If status changed to rejected, set reviewed_at timestamp
  IF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    NEW.reviewed_at = TIMEZONE('utc'::text, NOW());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to handle approval status changes
CREATE TRIGGER on_role_approval_status_change
  BEFORE UPDATE ON role_approvals
  FOR EACH ROW
  EXECUTE FUNCTION handle_role_approval_status_change();

-- Create function to prevent duplicate pending requests
CREATE OR REPLACE FUNCTION prevent_duplicate_pending_requests()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user already has a pending request for this role
  IF EXISTS (
    SELECT 1 FROM role_approvals 
    WHERE user_id = NEW.user_id 
    AND role_name = NEW.role_name 
    AND status = 'pending'
  ) THEN
    RAISE EXCEPTION 'User already has a pending approval request for this role';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent duplicate pending requests
CREATE TRIGGER prevent_duplicate_pending_requests_trigger
  BEFORE INSERT ON role_approvals
  FOR EACH ROW
  EXECUTE FUNCTION prevent_duplicate_pending_requests(); 