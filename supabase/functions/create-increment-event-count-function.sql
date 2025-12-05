-- Create function to increment event count when a registration is created
-- This function also updates the event status to 'Full' if capacity is reached
-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.increment_event_count(event_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_capacity INTEGER;
  max_capacity_val INTEGER;
BEGIN
  -- Get current and max capacity
  SELECT e.current_count, e.max_capacity
  INTO current_capacity, max_capacity_val
  FROM events e
  WHERE e.id = event_id;

  -- Check if event exists
  IF current_capacity IS NULL THEN
    RAISE EXCEPTION 'Event not found: %', event_id;
  END IF;

  -- Increment current count and update status if needed
  UPDATE events
  SET 
    current_count = events.current_count + 1,
    status = CASE 
      WHEN events.current_count + 1 >= max_capacity_val AND events.status = 'Open' THEN 'Full'
      ELSE events.status
    END
  WHERE events.id = event_id;
END;
$$;

-- Create function to decrement event count when a registration is cancelled
CREATE OR REPLACE FUNCTION public.decrement_event_count(event_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_capacity INTEGER;
  max_capacity_val INTEGER;
BEGIN
  -- Get current and max capacity
  SELECT e.current_count, e.max_capacity
  INTO current_capacity, max_capacity_val
  FROM events e
  WHERE e.id = event_id;

  -- Check if event exists
  IF current_capacity IS NULL THEN
    RAISE EXCEPTION 'Event not found: %', event_id;
  END IF;

  -- Decrement current count (but don't go below 0) and update status if needed
  UPDATE events
  SET 
    current_count = GREATEST(events.current_count - 1, 0),
    status = CASE 
      WHEN GREATEST(events.current_count - 1, 0) < max_capacity_val AND events.status = 'Full' THEN 'Open'
      ELSE events.status
    END
  WHERE events.id = event_id;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.increment_event_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_event_count(UUID) TO authenticated;

-- Verify the functions were created
-- SELECT routine_name, routine_type 
-- FROM information_schema.routines 
-- WHERE routine_schema = 'public' 
--   AND routine_name IN ('increment_event_count', 'decrement_event_count');

