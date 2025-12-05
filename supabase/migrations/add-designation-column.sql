-- Add designation column to users table
-- Run this in Supabase SQL Editor

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS designation TEXT;

-- Add index for faster queries if needed
CREATE INDEX IF NOT EXISTS idx_users_designation ON users(designation);

-- Verify the column was added
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'users' 
--   AND column_name = 'designation';

