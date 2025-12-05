# Add Mobile Number Field

This guide explains how to add the `mobile_number` column to your Supabase database.

## Database Update Required

You need to run a SQL script to add the `mobile_number` column to the `users` and `registrations` tables.

## Steps

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor**

2. **Run the SQL Script**
   - If you're setting up fresh, `supabase/schema.sql` already includes mobile_number columns
   - For existing databases, run `supabase/migrations/add-mobile-number.sql`

3. **Verify the Changes**
   - Go to **Table Editor** in Supabase
   - Check the `users` table - you should see a new `mobile_number` column
   - Check the `registrations` table - you should see a new `mobile_number` column

## What Was Changed

### Frontend
- ✅ Signup form now includes Mobile Number field
- ✅ Event registration form now includes Mobile Number field
- ✅ Member management (admin) now includes Mobile Number field

### Backend
- ✅ API routes updated to handle mobile number
- ✅ Database service updated to store/retrieve mobile number
- ✅ Export functionality (Excel/PDF) includes mobile number

### Database
- ⚠️ **You need to run the SQL script** to add the columns

## SQL Script Location

The SQL script is located at: `supabase/add-mobile-number.sql`

## Notes

- Mobile number is optional in the database (can be NULL)
- Mobile number is required when registering for events
- Mobile number is optional when signing up (but recommended)
- Mobile number format accepts: `+91 9876543210`, `9876543210`, etc.

