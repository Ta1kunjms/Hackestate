# Supabase Setup Guide

This guide will help you set up Supabase authentication for your real estate website.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `real-estate-app`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

## 2. Get Your Project Keys

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiI...` (long string)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root (`src/.env.local`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important**: 
- Replace the placeholder values with your actual Supabase credentials
- Never commit `.env.local` to version control
- The file is already in `.gitignore`

## 4. Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run this SQL:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## 5. Configure Authentication Settings

1. Go to **Authentication** > **Settings** in your Supabase dashboard
2. Configure these settings:

### Site URL
- **Site URL**: `http://localhost:3000` (for development)
- For production, add your deployed URL

### Redirect URLs
Add these redirect URLs:
- `http://localhost:3000/auth/callback`
- `http://localhost:3000/auth/reset-password`
- Add your production URLs when deploying

### Email Templates (Optional)
Customize the email templates in **Authentication** > **Email Templates**:
- Confirmation email
- Password reset email
- Magic link email

## 6. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/auth/register`
3. Try creating a new account
4. Check your email for verification
5. Test login with the new account

## 7. Database Schema Overview

```
auth.users (Supabase managed)
├── id (UUID, Primary Key)
├── email (TEXT)
├── email_confirmed_at (TIMESTAMP)
├── created_at (TIMESTAMP)
└── raw_user_meta_data (JSONB)

profiles (Your custom table)
├── id (UUID, Foreign Key to auth.users.id)
├── email (TEXT)
├── first_name (TEXT)
├── last_name (TEXT)
├── phone (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 8. Security Features

✅ **Row Level Security (RLS)**: Users can only access their own data
✅ **Email Verification**: Required for account activation
✅ **Password Reset**: Secure password reset flow
✅ **Session Management**: Automatic token refresh
✅ **HTTPS Only**: All requests are encrypted

## 9. Next Steps

After setup, you can:
- Implement OAuth providers (Google, GitHub, etc.)
- Add user roles and permissions
- Create property listings linked to users
- Set up real-time subscriptions
- Add profile picture uploads

## Troubleshooting

### Common Issues

**1. "Invalid API key" error**
- Double-check your environment variables
- Ensure no extra spaces in the keys
- Restart your development server

**2. "User not found" after registration**
- Check if email confirmation is enabled
- Look for the confirmation email
- Verify the trigger function is working

**3. CORS errors**
- Check your Site URL in Supabase settings
- Ensure redirect URLs are configured

**4. Profile not created**
- Verify the `handle_new_user()` function exists
- Check the trigger is properly set up
- Look at the Supabase logs for errors

Need help? Check the [Supabase documentation](https://supabase.com/docs) or the project issues. 