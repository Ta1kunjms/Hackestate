export interface UserRole {
  id: string;
  name: 'admin' | 'agent' | 'developer' | 'seller' | 'buyer';
  description: string;
  permissions: RolePermissions;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RolePermissions {
  // Admin permissions
  can_manage_users?: boolean;
  can_approve_agents?: boolean;
  can_approve_developers?: boolean;
  can_view_analytics?: boolean;
  can_manage_system?: boolean;
  
  // Agent permissions
  can_create_listings?: boolean;
  can_manage_listings?: boolean;
  can_contact_clients?: boolean;
  can_manage_inquiries?: boolean;
  
  // Developer permissions
  can_create_projects?: boolean;
  can_manage_projects?: boolean;
  can_manage_leads?: boolean;
  can_upload_documents?: boolean;
  
  // Seller permissions
  can_list_properties?: boolean;
  can_manage_properties?: boolean;
  can_review_offers?: boolean;
  can_upload_photos?: boolean;
  
  // Buyer permissions
  can_search_properties?: boolean;
  can_save_favorites?: boolean;
  can_make_offers?: boolean;
  can_view_listings?: boolean;
  can_contact_agents?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role_id: string;
  role?: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at?: string;
  created_at: string;
  profile?: UserProfile;
}

export interface UserRegistrationData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role_name: UserRole['name'];
}

export interface RoleApproval {
  id: string;
  user_id: string;
  role_name: 'agent' | 'developer';
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  documentation_url?: string;
  additional_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export type RoleName = UserRole['name']; 