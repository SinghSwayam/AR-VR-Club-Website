-- Make a User Admin
-- Run this in Supabase SQL Editor

-- Option 1: Update by Email (Recommended)
-- Replace 'user@example.com' with the actual email
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';

-- Option 2: Update by Firebase UID
-- Replace 'firebase-uid-here' with the actual Firebase UID
-- UPDATE users 
-- SET role = 'admin' 
-- WHERE user_id = 'firebase-uid-here';

-- Verify the update
SELECT user_id, name, email, role 
FROM users 
WHERE email = 'user@example.com';
-- Should show role = 'admin'

-- List all admins
-- SELECT user_id, name, email, role 
-- FROM users 
-- WHERE role = 'admin';

