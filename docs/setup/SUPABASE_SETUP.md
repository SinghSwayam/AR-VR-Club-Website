# Supabase Setup Guide

This guide will help you set up Supabase as your database for the AR/VR Club platform.

## Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `ar-vr-club-ghrcem` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is sufficient
5. Click **"Create new project"**
6. Wait 2-3 minutes for project to be created

## Step 2: Get API Keys

1. In your Supabase project dashboard, go to **Settings** > **API**
2. You'll need:
   - **Project URL** (under "Project URL")
   - **Service Role Key** (under "Project API keys" > "service_role" key) - **Keep this secret!**
   - **Anon Key** (under "Project API keys" > "anon" key) - Optional for now

## Step 3: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the entire contents of `supabase/schema.sql` (this is the complete schema with all features)
4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 4: Verify Tables Created

1. Go to **Table Editor** in Supabase dashboard
2. You should see 4 tables:
   - `events`
   - `users`
   - `registrations`
   - `winners`

## Step 5: Configure Environment Variables

1. Open your `.env.local` file
2. Add these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:**
- Replace `your-project-id` with your actual Supabase project ID
- Replace `your-service-role-key-here` with the Service Role Key from Step 2
- Replace `your-anon-key-here` with the Anon Key from Step 2 (optional but recommended)

## Step 6: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit: `http://localhost:3000/api/test-sheets` (we'll update this endpoint name later)

3. You should see a success message with data counts

## Step 7: Migrate Existing Data (Optional)

If you have data in Google Sheets that you want to migrate:

1. Export data from Google Sheets to CSV
2. In Supabase dashboard, go to **Table Editor**
3. Select the table (e.g., `events`)
4. Click **"Insert"** > **"Import data from CSV"**
5. Upload your CSV file
6. Map columns correctly
7. Click **"Import"**

## Step 8: Verify Everything Works

1. Try registering for an event from the dashboard
2. Check Supabase **Table Editor** > `registrations` table
3. You should see the new registration!

## Troubleshooting

### Error: "Missing NEXT_PUBLIC_SUPABASE_URL"
- Make sure `.env.local` has all required variables
- Restart your dev server after adding env variables

### Error: "relation does not exist"
- Make sure you ran the SQL schema in Step 3
- Check that all 4 tables exist in Table Editor

### Error: "permission denied"
- Check that RLS policies are set correctly (they should be from the schema.sql)
- Verify Service Role Key is correct

### Data not saving
- Check browser console for errors
- Check server logs (terminal where `npm run dev` is running)
- Verify API routes are using `getSupabaseService()` instead of `getSheetsService()`

## Next Steps

- ✅ Database is set up
- ✅ API routes are updated
- ✅ Export functionality is ready
- 🔄 Update frontend components if needed
- 🔄 Add admin export UI buttons

## Export Features

Admins can now export data to Excel or PDF:

- **Excel**: `/api/export?type=registrations&format=excel`
- **PDF**: `/api/export?type=events&format=pdf`

Available types: `events`, `registrations`, `users`, `winners`

## Support

If you encounter issues:
1. Check Supabase dashboard logs
2. Check browser console
3. Check server terminal logs
4. Verify all environment variables are set correctly

