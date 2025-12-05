-- Add mobile_number column to users and registrations tables
-- Run this in Supabase SQL Editor

-- Add mobile_number to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS mobile_number TEXT;

-- Add mobile_number to registrations table
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS mobile_number TEXT;

-- Add index for faster queries if needed
CREATE INDEX IF NOT EXISTS idx_users_mobile_number ON users(mobile_number);
CREATE INDEX IF NOT EXISTS idx_registrations_mobile_number ON registrations(mobile_number);

-- Verify the columns were added
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name IN ('users', 'registrations')
--   AND column_name = 'mobile_number';

