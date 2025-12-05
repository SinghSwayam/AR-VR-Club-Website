# Complete Setup Guide

This guide covers all setup steps for the AR/VR Club platform.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Firebase Setup](#firebase-setup)
4. [Supabase Setup](#supabase-setup)
5. [Database Schema](#database-schema)
6. [Admin Setup](#admin-setup)
7. [Feature Setup](#feature-setup)

## Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** package manager
- A **Supabase account** (free tier available) - [Sign up](https://supabase.com)
- A **Firebase account** (free tier available) - [Sign up](https://firebase.google.com)

## Environment Setup

### Step 1: Create `.env.local` File

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 2: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to **Project Settings** > **General** > **Your apps**
4. Copy the configuration values to `.env.local`

### Step 3: Enable Firebase Authentication

1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable **Google Sign-In**:
   - Click on "Google"
   - Toggle **Enable**
   - Enter support email
   - Click **Save**
   - Add authorized domains if needed

### Step 4: Get Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Find the **Legacy anon, service_role API keys** section
5. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
   - **anon** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Setup

### Step 1: Create Database Schema

1. Go to Supabase SQL Editor
2. Open `supabase/complete-schema.sql`
3. Copy and run the entire script
4. This creates all tables, functions, indexes, and permissions

### Step 2: Verify Tables

Go to **Table Editor** and verify these tables exist:
- `events`
- `users`
- `registrations`
- `inquiries`
- `winners`

## Database Schema

The complete schema is in `supabase/complete-schema.sql`. This includes:
- All tables with proper columns
- Foreign key constraints with CASCADE delete
- Indexes for performance
- Functions for event count management
- Triggers for auto-updating timestamps
- Row Level Security policies

## Admin Setup

### Create Admin User

1. Sign up a user account through the login page
2. Go to Supabase SQL Editor
3. Run `supabase/make-user-admin.sql` with your user's email:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

4. Sign out and sign back in
5. You should now see the admin dashboard

## Feature Setup

### Mobile Number Feature

If you need to add mobile number support to existing tables:

1. Go to Supabase SQL Editor
2. Run `supabase/add-mobile-number.sql`

### Designation Feature

To add designation support for members:

1. Go to Supabase SQL Editor
2. Run `supabase/add-designation-column.sql`

### Year/Department/Roll Number

If these columns are missing from registrations:

1. Go to Supabase SQL Editor
2. Run `supabase/add-year-dept-to-registrations.sql`

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## Troubleshooting

### "Invalid API key" Error
- Check that all environment variables are set in `.env.local`
- Restart the development server after changing `.env.local`
- Verify keys are from the correct Supabase project

### Database Errors
- Ensure you've run `supabase/complete-schema.sql`
- Check that all tables exist in Supabase Table Editor
- Verify foreign key constraints are set up correctly

### Authentication Issues
- Verify Firebase Authentication is enabled
- Check that email/password sign-in method is enabled
- For Google Sign-In, ensure it's enabled and authorized domains are set

