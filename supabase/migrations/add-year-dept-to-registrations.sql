-- Add year, dept, and roll_no columns to registrations table
-- Run this in Supabase SQL Editor
-- This is required for event registration to work properly

-- Add the columns if they don't exist
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS year TEXT,
ADD COLUMN IF NOT EXISTS dept TEXT,
ADD COLUMN IF NOT EXISTS roll_no TEXT;

-- Verify the columns were added (optional - you can run this to check)
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'registrations' 
--   AND column_name IN ('year', 'dept', 'roll_no');
