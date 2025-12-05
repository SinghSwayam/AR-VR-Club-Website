-- Fix foreign key constraint to enable CASCADE delete
-- Run this in Supabase SQL Editor
-- This allows deleting events even if they have registrations

-- Step 1: Check existing constraints
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.table_name = 'registrations' 
  AND tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'events';

-- Step 2: Drop ALL existing foreign key constraints on event_id
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = 'registrations'
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name IN (
            SELECT tc.constraint_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage ccu
                ON ccu.constraint_name = tc.constraint_name
            WHERE tc.table_name = 'registrations'
            AND kcu.column_name IN ('event_id', 'EventID')
            AND ccu.table_name = 'events'
        )
    ) LOOP
        EXECUTE 'ALTER TABLE registrations DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name) || ' CASCADE';
    END LOOP;
END $$;

-- Step 3: Recreate with CASCADE delete
ALTER TABLE registrations 
ADD CONSTRAINT registrations_event_id_fkey 
FOREIGN KEY (event_id) 
REFERENCES events(id) 
ON DELETE CASCADE;

-- Step 4: Verify the constraint is set correctly
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.table_name = 'registrations' 
  AND tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'events';

-- Should show delete_rule = 'CASCADE'
