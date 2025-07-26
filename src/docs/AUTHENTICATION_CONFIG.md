# Enhanced Authentication Configuration

This guide extends the basic Supabase authentication setup with role-based features and advanced email templates.

## 1. Extended Authentication Settings

### 1.1 Site URL Configuration
In your Supabase dashboard, go to **Authentication** > **Settings**:

**Site URL:**
- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

**Redirect URLs:**
Add these additional redirect URLs for role-based flows:
```
http://localhost:3000/auth/callback
http://localhost:3000/auth/reset-password
http://localhost:3000/auth/role-selection
http://localhost:3000/auth/approval-pending
http://localhost:3000/auth/approval-approved
http://localhost:3000/auth/approval-rejected
```

### 1.2 Email Confirmation Settings
Configure email confirmation behavior:

**Enable email confirmations:** ✅ (Required)
**Secure email change:** ✅ (Recommended)
**Double confirm changes:** ✅ (Recommended)

### 1.3 Session Management
Configure session settings for role-based access:

**JWT Expiry:** 3600 seconds (1 hour)
**Refresh Token Rotation:** ✅ (Recommended)
**Refresh Token Reuse Detection:** ✅ (Recommended)

## 2. Enhanced Email Templates

### 2.1 Email Confirmation Template
Customize the confirmation email in **Authentication** > **Email Templates** > **Confirm signup**:

**Subject:** `Confirm your account - Real Estate Platform`

**HTML Template:**
```html
<h2>Welcome to Real Estate Platform!</h2>
<p>Hi {{ .Email }},</p>
<p>Thank you for registering with us. Please confirm your email address to activate your account.</p>
<p>Your selected role: <strong>{{ .RoleName }}</strong></p>
<p><a href="{{ .ConfirmationURL }}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Confirm Email</a></p>
<p>If you didn't create this account, you can safely ignore this email.</p>
<p>Best regards,<br>The Real Estate Platform Team</p>
```

### 2.2 Password Reset Template
**Subject:** `Reset your password - Real Estate Platform`

**HTML Template:**
```html
<h2>Password Reset Request</h2>
<p>Hi {{ .Email }},</p>
<p>We received a request to reset your password. Click the button below to create a new password:</p>
<p><a href="{{ .ConfirmationURL }}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
<p>This link will expire in 1 hour for security reasons.</p>
<p>If you didn't request this reset, please ignore this email.</p>
<p>Best regards,<br>The Real Estate Platform Team</p>
```

### 2.3 Role Approval Templates

#### 2.3.1 Approval Request Received
**Subject:** `Role approval request received - Real Estate Platform`

**HTML Template:**
```html
<h2>Role Approval Request Received</h2>
<p>Hi {{ .FirstName }},</p>
<p>We have received your request to become a <strong>{{ .RoleName }}</strong> on our platform.</p>
<p>Your application is now under review. We will notify you once a decision has been made.</p>
<p>Application details:</p>
<ul>
  <li>Role: {{ .RoleName }}</li>
  <li>Submitted: {{ .SubmittedAt }}</li>
  <li>Status: Pending Review</li>
</ul>
<p>You can check your application status in your profile dashboard.</p>
<p>Best regards,<br>The Real Estate Platform Team</p>
```

#### 2.3.2 Approval Granted
**Subject:** `Congratulations! Your role approval has been granted - Real Estate Platform`

**HTML Template:**
```html
<h2>Role Approval Granted!</h2>
<p>Hi {{ .FirstName }},</p>
<p>Great news! Your application to become a <strong>{{ .RoleName }}</strong> has been approved.</p>
<p>You now have access to all features available to {{ .RoleName }}s on our platform.</p>
<p><a href="{{ .DashboardURL }}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Access Your Dashboard</a></p>
<p>If you have any questions, please don't hesitate to contact our support team.</p>
<p>Best regards,<br>The Real Estate Platform Team</p>
```

#### 2.3.3 Approval Rejected
**Subject:** `Role approval decision - Real Estate Platform`

**HTML Template:**
```html
<h2>Role Approval Decision</h2>
<p>Hi {{ .FirstName }},</p>
<p>We have reviewed your application to become a <strong>{{ .RoleName }}</strong>.</p>
<p>Unfortunately, we are unable to approve your application at this time.</p>
<p><strong>Reason:</strong> {{ .RejectionReason }}</p>
<p>You can submit a new application with additional documentation or clarification.</p>
<p><a href="{{ .ReapplyURL }}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Submit New Application</a></p>
<p>If you have questions about this decision, please contact our support team.</p>
<p>Best regards,<br>The Real Estate Platform Team</p>
```

## 3. Role-Based Authentication Configuration

### 3.1 User Registration Flow
Configure the registration flow to include role selection:

1. **Basic Registration** (buyer/seller): Immediate access
2. **Extended Registration** (agent/developer): Requires approval

### 3.2 Session Configuration
Update the Supabase client configuration to include role information:

```typescript
// In src/lib/supabase.ts
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})
```

### 3.3 Role-Based Redirect Logic
Implement role-based redirects after authentication:

```typescript
// Example redirect logic
const getRedirectUrl = (userRole: string) => {
  switch (userRole) {
    case 'admin':
      return '/admin/dashboard';
    case 'agent':
      return '/agent/dashboard';
    case 'developer':
      return '/developer/dashboard';
    case 'seller':
      return '/seller/dashboard';
    case 'buyer':
      return '/buyer/dashboard';
    default:
      return '/dashboard';
  }
};
```

## 4. Security Enhancements

### 4.1 Rate Limiting
Configure rate limiting for authentication endpoints:

- **Sign up:** 5 attempts per hour per IP
- **Sign in:** 10 attempts per hour per IP
- **Password reset:** 3 attempts per hour per email

### 4.2 Password Policy
Enforce strong password requirements:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### 4.3 Session Security
- **JWT Expiry:** 1 hour
- **Refresh Token Expiry:** 30 days
- **Secure Cookie Settings:** HttpOnly, Secure, SameSite=Strict

## 5. Testing Authentication Flow

### 5.1 Test Cases
1. **Basic Registration (Buyer/Seller):**
   - Register with valid email
   - Confirm email
   - Access buyer/seller dashboard

2. **Extended Registration (Agent/Developer):**
   - Register with agent/developer role
   - Receive approval request email
   - Wait for admin approval
   - Receive approval/rejection email

3. **Password Reset:**
   - Request password reset
   - Receive reset email
   - Reset password successfully

4. **Role Switching:**
   - User with multiple roles
   - Switch between roles
   - Maintain session state

### 5.2 Admin Testing
1. **Approval Workflow:**
   - View pending approvals
   - Approve/reject applications
   - Send notification emails

2. **User Management:**
   - View all users
   - Manage user roles
   - Suspend/activate accounts

## 6. Environment Variables

Add these to your `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Email Configuration (if using custom SMTP)
SUPABASE_SMTP_HOST=smtp.gmail.com
SUPABASE_SMTP_PORT=587
SUPABASE_SMTP_USER=your_email@gmail.com
SUPABASE_SMTP_PASS=your_app_password

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3000/dashboard
```

## 7. Monitoring and Logs

### 7.1 Authentication Logs
Monitor authentication events in Supabase dashboard:
- **Authentication** > **Logs**
- Track failed login attempts
- Monitor role approval requests
- Review email delivery status

### 7.2 Error Handling
Implement proper error handling for:
- Invalid credentials
- Email confirmation failures
- Role approval rejections
- Session expiration

This enhanced configuration provides a complete role-based authentication system with proper email templates, security measures, and testing procedures. 