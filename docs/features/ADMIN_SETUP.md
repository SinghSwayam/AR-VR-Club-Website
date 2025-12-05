# Admin Login & Setup Guide

## How Admin Login Works

Admins use the **same login page** as regular users (`/login`), but with an important step:

1. **Select "Admin" role** before signing in (you'll see two buttons: 🎓 Student and 🔧 Admin)
2. Authenticate with Firebase (email/password or Google)
3. The system verifies that your account role matches your selection
4. If the role matches, you're redirected to `/admin` (or `/dashboard` for students)
5. If the role doesn't match, you'll see an error message

**Important:** You must select the correct role (Student/Admin) before signing in. The system will verify that your account in the database has the matching role.

## Setting Up an Admin User

### Method 1: Update Existing User to Admin (Recommended)

If you already have a user account and want to make it admin:

1. **Get the user's email or Firebase UID**
   - You can find this in Firebase Console → Authentication → Users
   - Or in Supabase → Table Editor → `users` table

2. **Run this SQL in Supabase SQL Editor:**

```sql
-- Replace 'user@example.com' with the actual email of the user you want to make admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

Or by Firebase UID:

```sql
-- Replace 'firebase-uid-here' with the actual Firebase UID
UPDATE users 
SET role = 'admin' 
WHERE user_id = 'firebase-uid-here';
```

### Method 2: Create Admin User During Sign-Up

When creating a new user account, you can manually set the role in Supabase:

1. **Sign up normally** through the website (creates user with 'student' role)
2. **Update the role** using Method 1 above

### Method 3: Direct Database Insert (Advanced)

If you want to create an admin user directly in the database:

```sql
-- First, create the user in Firebase Authentication
-- Then run this SQL (replace with actual values):
INSERT INTO users (user_id, name, email, role, year, dept)
VALUES (
  'firebase-uid-from-firebase-console',
  'Admin Name',
  'admin@example.com',
  'admin',
  '',
  ''
);
```

## Verifying Admin Access

1. **Check the user's role in Supabase:**
   ```sql
   SELECT user_id, name, email, role 
   FROM users 
   WHERE email = 'admin@example.com';
   ```
   Should show `role = 'admin'`

2. **Sign in with the admin account:**
   - Go to `/login`
   - **Select "🔧 Admin"** (you'll see two role buttons)
   - Sign in with email/password or Google
   - You should be automatically redirected to `/admin`

3. **If you're not redirected:**
   - Check browser console for errors
   - Verify the role is set correctly in Supabase
   - Try signing out and signing in again

## Admin Dashboard Access

Once logged in as admin:
- **URL**: `/admin`
- **Features**: Event Management, Member Management, Export Data, etc.
- **Protection**: Non-admin users are automatically redirected to `/dashboard`

## Troubleshooting

### "I'm logged in but can't access /admin"
- **Make sure you selected "Admin"** before signing in (not "Student")
- **Check your role**: Run `SELECT role FROM users WHERE email = 'your-email@example.com'` in Supabase
- **Update if needed**: Use Method 1 above to set role to 'admin'
- **Clear browser cache** and sign in again, making sure to select "Admin" role

### "You are trying to sign in as admin, but your account is registered as student"
- This means your account doesn't have admin role in the database
- Follow "Method 1" above to update your role to 'admin' in Supabase
- Then try signing in again with "Admin" selected

### "I want to remove admin access"
```sql
UPDATE users 
SET role = 'student' 
WHERE email = 'user@example.com';
```

### "Multiple admins"
You can have multiple admin users. Just set `role = 'admin'` for each user you want to be admin.

## Security Notes

- **Admin role is stored in Supabase**, not Firebase
- **Firebase handles authentication** (login/logout)
- **Supabase handles authorization** (who can access what)
- Always use strong passwords for admin accounts
- Consider using Google Sign-In for easier admin access

## Quick Reference

```sql
-- Make a user admin
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';

-- Remove admin access
UPDATE users SET role = 'student' WHERE email = 'user@example.com';

-- List all admins
SELECT user_id, name, email FROM users WHERE role = 'admin';

-- Check a specific user's role
SELECT email, role FROM users WHERE email = 'user@example.com';
```

