# Environment Variables Setup Guide

## Quick Fix for "Invalid API key" Error

The error `Invalid API key` means your Supabase environment variables are missing or incorrect.

## Step 1: Get Your Supabase API Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create one if you haven't)
3. Go to **Settings** → **API**
4. You'll see:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon** `public` key (starts with `eyJ...`)
   - **service_role** `secret` key (starts with `eyJ...`)

## Step 2: Update `.env.local`

Open your `.env.local` file in the root directory and make sure it has:

```env
# Firebase Configuration (keep your existing Firebase vars)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Supabase Configuration (REQUIRED - add these)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your service_role key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your anon key)
```

**Important:**
- Replace `your-project-id` with your actual Supabase project ID from the URL
- Copy the **entire** service_role key (it's long, starts with `eyJ`)
- Copy the **entire** anon key (also starts with `eyJ`)
- Don't add quotes around the values
- No spaces around the `=` sign

## Step 3: Restart Your Dev Server

After updating `.env.local`, you **MUST** restart the server:

1. Stop the current server (Ctrl+C or Cmd+C)
2. Start it again:
   ```bash
   npm run dev
   ```

Next.js only reads `.env.local` when the server starts, so changes won't take effect until you restart.

## Step 4: Verify It Works

After restarting, check the terminal. You should **NOT** see "Invalid API key" errors anymore.

## Common Issues

### Issue: Still getting "Invalid API key"
- ✅ Make sure you copied the **entire** key (they're very long)
- ✅ Make sure there are no extra spaces or quotes
- ✅ Make sure you restarted the dev server
- ✅ Check that `NEXT_PUBLIC_SUPABASE_URL` starts with `https://` and ends with `.supabase.co`

### Issue: "Missing NEXT_PUBLIC_SUPABASE_URL"
- ✅ Make sure the variable name is exactly `NEXT_PUBLIC_SUPABASE_URL` (case-sensitive)
- ✅ Make sure it's in `.env.local` (not `.env`)

### Issue: Keys look correct but still not working
- ✅ Make sure you're using the **service_role** key (not anon key) for `SUPABASE_SERVICE_ROLE_KEY`
- ✅ The service_role key is the one marked as "secret" in Supabase dashboard
- ✅ Make sure your Supabase project is active (not paused)

## Need Help?

If you haven't created a Supabase project yet, follow the guide in `SUPABASE_SETUP.md`.

