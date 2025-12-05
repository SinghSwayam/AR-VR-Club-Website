# Club Inquiry Setup Guide

This guide explains how to set up the Club Inquiry feature for managing contact form submissions.

## Step 1: Create the Inquiries Table in Supabase

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor** (in the left sidebar)

2. **Run the SQL Script**
   - The inquiries table is included in `supabase/schema.sql`
   - If you already ran `schema.sql`, the table should exist
   - If not, you can run just the inquiries section from `supabase/schema.sql`
   - Or check Supabase Table Editor to verify the `inquiries` table exists

3. **Verify the Table**
   - Go to **Table Editor** in Supabase
   - You should see a new `inquiries` table with the following columns:
     - `id` (UUID, primary key)
     - `name` (TEXT)
     - `email` (TEXT)
     - `message` (TEXT)
     - `status` (TEXT: pending, read, replied, resolved)
     - `created_at` (TIMESTAMP)
     - `updated_at` (TIMESTAMP)

## Step 2: How It Works

### Contact Form Flow
1. User fills out the contact form on the homepage
2. Form submission is sent to `/api/contact`
3. The inquiry is saved to the `inquiries` table in Supabase with status `pending`
4. User sees a success message

### Admin Dashboard Flow
1. Admin navigates to **Club Inquiry** in the sidebar
2. All inquiries are displayed in a table
3. Admin can:
   - **Filter** by status or search by name/email/message
   - **Update status** (pending → read → replied → resolved)
   - **Copy** inquiry details to clipboard
   - **Delete** inquiries
   - **Refresh** to see new inquiries (auto-refreshes every 30 seconds)

## Step 3: Status Types

- **Pending**: New inquiry, not yet viewed
- **Read**: Inquiry has been viewed by admin
- **Replied**: Admin has responded to the inquiry
- **Resolved**: Inquiry has been fully resolved

## Features

- ✅ Auto-refresh every 30 seconds to catch new inquiries
- ✅ Manual refresh button
- ✅ Filter by status
- ✅ Search by name, email, or message
- ✅ Update status with dropdown
- ✅ Copy inquiry details to clipboard
- ✅ Delete inquiries
- ✅ Stats showing total and pending counts
- ✅ Clickable email addresses (opens email client)

## Troubleshooting

### "Table 'inquiries' does not exist"
- Make sure you ran the SQL script in Supabase SQL Editor
- Check that the table appears in Table Editor

### Inquiries not showing up
- Check that the contact form is saving to the database (check browser console)
- Verify the API route `/api/admin/inquiries` is working
- Check Supabase logs for any errors

### Can't update status
- Verify the inquiry ID is correct
- Check browser console for API errors
- Ensure you're logged in as admin

