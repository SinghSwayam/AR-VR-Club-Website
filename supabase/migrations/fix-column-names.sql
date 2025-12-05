-- Fix column names to match schema (snake_case)
-- Run this in Supabase SQL Editor if your tables have PascalCase column names

-- Fix users table
DO $$ 
BEGIN
  -- Rename CreatedAt to created_at if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'users' AND column_name = 'CreatedAt') THEN
    ALTER TABLE users RENAME COLUMN "CreatedAt" TO created_at;
  END IF;
  
  -- Rename other PascalCase columns if they exist
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'users' AND column_name = 'UserID') THEN
    ALTER TABLE users RENAME COLUMN "UserID" TO user_id;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'users' AND column_name = 'Name') THEN
    ALTER TABLE users RENAME COLUMN "Name" TO name;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'users' AND column_name = 'Email') THEN
    ALTER TABLE users RENAME COLUMN "Email" TO email;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'users' AND column_name = 'Role') THEN
    ALTER TABLE users RENAME COLUMN "Role" TO role;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'users' AND column_name = 'Year') THEN
    ALTER TABLE users RENAME COLUMN "Year" TO year;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'users' AND column_name = 'Dept') THEN
    ALTER TABLE users RENAME COLUMN "Dept" TO dept;
  END IF;
END $$;

-- Fix events table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'events' AND column_name = 'CreatedAt') THEN
    ALTER TABLE events RENAME COLUMN "CreatedAt" TO created_at;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'events' AND column_name = 'ID') THEN
    ALTER TABLE events RENAME COLUMN "ID" TO id;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'events' AND column_name = 'Title') THEN
    ALTER TABLE events RENAME COLUMN "Title" TO title;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'events' AND column_name = 'Description') THEN
    ALTER TABLE events RENAME COLUMN "Description" TO description;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'events' AND column_name = 'StartTime') THEN
    ALTER TABLE events RENAME COLUMN "StartTime" TO start_time;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'events' AND column_name = 'EndTime') THEN
    ALTER TABLE events RENAME COLUMN "EndTime" TO end_time;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'events' AND column_name = 'MaxCapacity') THEN
    ALTER TABLE events RENAME COLUMN "MaxCapacity" TO max_capacity;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'events' AND column_name = 'CurrentCount') THEN
    ALTER TABLE events RENAME COLUMN "CurrentCount" TO current_count;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'events' AND column_name = 'Status') THEN
    ALTER TABLE events RENAME COLUMN "Status" TO status;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'events' AND column_name = 'ImageURL') THEN
    ALTER TABLE events RENAME COLUMN "ImageURL" TO image_url;
  END IF;
END $$;

-- Fix registrations table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'registrations' AND column_name = 'RegistrationID') THEN
    ALTER TABLE registrations RENAME COLUMN "RegistrationID" TO registration_id;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'registrations' AND column_name = 'EventID') THEN
    ALTER TABLE registrations RENAME COLUMN "EventID" TO event_id;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'registrations' AND column_name = 'UserID') THEN
    ALTER TABLE registrations RENAME COLUMN "UserID" TO user_id;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'registrations' AND column_name = 'UserEmail') THEN
    ALTER TABLE registrations RENAME COLUMN "UserEmail" TO user_email;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'registrations' AND column_name = 'Timestamp') THEN
    ALTER TABLE registrations RENAME COLUMN "Timestamp" TO timestamp;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'registrations' AND column_name = 'Status') THEN
    ALTER TABLE registrations RENAME COLUMN "Status" TO status;
  END IF;
END $$;

-- Fix winners table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'winners' AND column_name = 'CreatedAt') THEN
    ALTER TABLE winners RENAME COLUMN "CreatedAt" TO created_at;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'winners' AND column_name = 'ID') THEN
    ALTER TABLE winners RENAME COLUMN "ID" TO id;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'winners' AND column_name = 'EventName') THEN
    ALTER TABLE winners RENAME COLUMN "EventName" TO event_name;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'winners' AND column_name = 'EventDate') THEN
    ALTER TABLE winners RENAME COLUMN "EventDate" TO event_date;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'winners' AND column_name = 'FirstPlace') THEN
    ALTER TABLE winners RENAME COLUMN "FirstPlace" TO first_place;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'winners' AND column_name = 'SecondPlace') THEN
    ALTER TABLE winners RENAME COLUMN "SecondPlace" TO second_place;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'winners' AND column_name = 'ThirdPlace') THEN
    ALTER TABLE winners RENAME COLUMN "ThirdPlace" TO third_place;
  END IF;
END $$;

-- Verify the changes
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('users', 'events', 'registrations', 'winners')
ORDER BY table_name, ordinal_position;

