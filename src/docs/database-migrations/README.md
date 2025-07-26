# Database Migrations

This directory contains SQL migration files for setting up the Supabase database schema for the real estate application.

## Migration Files

1. **01_create_user_roles.sql** - Creates user roles and permissions system
2. **02_create_role_approvals.sql** - Creates role approval workflow
3. **03_create_events_table.sql** - Creates events table for managing real estate events
4. **04_create_properties_table.sql** - Creates properties table for real estate listings
5. **05_create_supporting_tables.sql** - Creates additional supporting tables

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order (01, 02, 03, 04, 05)
4. Copy and paste the SQL content and click "Run"

### Option 2: Supabase CLI

If you have Supabase CLI installed:

```bash
# Navigate to your project directory
cd your-project-directory

# Run migrations
supabase db push
```

### Option 3: Direct SQL Execution

1. Open your Supabase project
2. Go to **SQL Editor**
3. Execute each file in sequence:

```sql
-- Run 01_create_user_roles.sql first
-- Then 02_create_role_approvals.sql
-- Then 03_create_events_table.sql
-- Then 04_create_properties_table.sql
-- Finally 05_create_supporting_tables.sql
```

## Prerequisites

Before running these migrations, ensure you have:

1. **Supabase project created** with authentication enabled
2. **profiles table exists** (created by Supabase Auth)
3. **update_updated_at_column() function** exists (usually auto-created by Supabase)

## Tables Created

### Core Tables
- `user_roles` - User role definitions and permissions
- `role_approvals` - Role approval workflow
- `events` - Real estate events, seminars, workshops
- `properties` - Real estate listings

### Supporting Tables
- `property_views` - Track property view analytics
- `inquiries` - Property inquiries from users
- `saved_properties` - User favorites/bookmarks
- `sales` - Property sales tracking
- `reviews` - Property and agent reviews

## Row Level Security (RLS)

All tables have Row Level Security enabled with appropriate policies:

- **Admins** can access all data
- **Agents** can manage their own properties and sales
- **Users** can view published content and manage their own data
- **Public** can view published properties and events

## Troubleshooting

### Common Issues

1. **"function update_updated_at_column() does not exist"**
   - This function is usually auto-created by Supabase
   - If missing, create it manually or check Supabase documentation

2. **"table profiles does not exist"**
   - Ensure Supabase Auth is enabled
   - The profiles table is created automatically with Auth

3. **"permission denied"**
   - Check that you're running as a database owner
   - Verify RLS policies are correctly configured

### Verification

After running migrations, verify the setup:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('events', 'properties', 'user_roles');

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('events', 'properties');
```

## Next Steps

After running migrations:

1. **Test the admin dashboard** - Try creating events and properties
2. **Verify permissions** - Test different user roles
3. **Add sample data** - Create test events and properties
4. **Configure storage** - Set up image upload buckets if needed

## ⚠️ IMPORTANT: Fix for Event Count Issue

If you're seeing "0" in the Events tab count in the admin sidebar, it means the `events` table doesn't exist yet. Run these migrations in order:

1. `03_create_events_table.sql` - Creates the events table
2. `04_create_properties_table.sql` - Creates the properties table  
3. `05_create_supporting_tables.sql` - Creates other supporting tables
4. `06_create_event_registrations.sql` - Creates the event registrations table

After running these migrations, the event count should update correctly! 