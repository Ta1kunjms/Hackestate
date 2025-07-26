# User Roles Setup Guide

This guide explains how to set up user roles and admin access for the real estate platform.

## Overview

The platform supports 5 user roles:
- **Admin**: Full system access with user management capabilities
- **Agent**: Real estate agent with listing management and client interactions
- **Developer**: Property developer with project management and lead tracking
- **Seller**: Property seller with property management and offer review
- **Buyer**: Property buyer with search and favorites functionality

## Database Setup

### 1. Run Database Migrations

First, ensure you've run the database migrations to create the user roles system:

```sql
-- Run the migration files in order:
-- 1. src/docs/database-migrations/01_create_user_roles.sql
-- 2. src/docs/database-migrations/02_create_role_approvals.sql
```

### 2. Verify Role Creation

Check that the roles were created successfully:

```sql
SELECT * FROM user_roles;
```

You should see 5 roles: admin, agent, developer, seller, buyer.

## Creating an Admin User

### Option 1: Using the Script

1. Set your environment variables:
```bash
export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

2. Run the admin creation script:
```bash
node scripts/create-admin-user.js
```

This will create an admin user with:
- Email: admin@realestate.com
- Password: admin123456

### Option 2: Manual Creation

1. Create a user through the registration form
2. Update their role in the database:

```sql
-- Get the user's profile ID
SELECT id FROM profiles WHERE email = 'your-email@example.com';

-- Get the admin role ID
SELECT id FROM user_roles WHERE name = 'admin';

-- Update the user's role
UPDATE profiles 
SET role_id = (SELECT id FROM user_roles WHERE name = 'admin')
WHERE email = 'your-email@example.com';
```

## Testing Admin Access

1. Log in with your admin credentials
2. Navigate to `/admin` - you should see the admin dashboard
3. If you get an "Access Denied" message, check that:
   - The user exists in the `profiles` table
   - The user has the correct `role_id` pointing to the admin role
   - The user is authenticated

## Role-Based Access Control

The platform uses role-based access control (RBAC) with the following components:

### ProtectedRoute Component

Use this to protect routes that require specific roles or permissions:

```tsx
import ProtectedRoute from '../components/auth/ProtectedRoute';

<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

### Permission Checks

Check permissions in components:

```tsx
import { useAuth } from '../contexts/AuthContext';

const { hasPermission } = useAuth();

if (hasPermission('can_manage_users')) {
  // Show user management features
}
```

## Available Permissions

### Admin Permissions
- `can_manage_users`: Manage all users
- `can_approve_agents`: Approve agent applications
- `can_approve_developers`: Approve developer applications
- `can_view_analytics`: View system analytics
- `can_manage_system`: Manage system settings

### Agent Permissions
- `can_create_listings`: Create property listings
- `can_manage_listings`: Manage their listings
- `can_contact_clients`: Contact clients
- `can_manage_inquiries`: Manage client inquiries

### Developer Permissions
- `can_create_projects`: Create development projects
- `can_manage_projects`: Manage their projects
- `can_manage_leads`: Manage leads
- `can_upload_documents`: Upload project documents

### Seller Permissions
- `can_list_properties`: List properties for sale
- `can_manage_properties`: Manage their properties
- `can_review_offers`: Review offers from buyers
- `can_upload_photos`: Upload property photos

### Buyer Permissions
- `can_search_properties`: Search for properties
- `can_save_favorites`: Save favorite properties
- `can_make_offers`: Make offers on properties
- `can_view_listings`: View property listings
- `can_contact_agents`: Contact agents

## Troubleshooting

### Common Issues

1. **"Access Denied" on admin page**
   - Check that the user has the admin role in the database
   - Verify the user is properly authenticated
   - Check browser console for errors

2. **Role not loading**
   - Ensure the database migrations have been run
   - Check that the `user_roles` table exists and has data
   - Verify the foreign key relationship between `profiles` and `user_roles`

3. **Authentication issues**
   - Check Supabase configuration
   - Verify environment variables are set correctly
   - Check browser console for authentication errors

### Debug Commands

Check user roles in the database:

```sql
-- Check all users and their roles
SELECT 
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  ur.name as role_name
FROM profiles p
JOIN user_roles ur ON p.role_id = ur.id
ORDER BY p.created_at DESC;
```

Check role permissions:

```sql
-- Check role permissions
SELECT 
  name,
  permissions
FROM user_roles
ORDER BY name;
```

## Next Steps

After setting up admin access:

1. **Test all admin features** in the admin dashboard
2. **Create test users** with different roles
3. **Test role-based access** for different user types
4. **Implement approval workflows** for agent and developer roles
5. **Add role-specific dashboards** for each user type

## Security Notes

- Admin users have full system access - use with caution
- Consider implementing two-factor authentication for admin accounts
- Regularly audit admin user access
- Use environment variables for sensitive configuration
- Implement proper logging for admin actions 