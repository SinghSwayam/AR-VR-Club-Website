/**
 * API Route: /api/events
 * Handles GET (all events) and POST (create event) requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseService } from '@/lib/supabase/service';

// GET /api/events - Get all events (public)
export async function GET() {
  try {
    const service = getSupabaseService();
    const events = await service.getAllEvents();

    // Transform to match expected format (for backward compatibility with frontend)
    const transformedEvents = events.map(event => ({
      ID: event.id,
      Title: event.title,
      Description: event.description,
      StartTime: event.start_time,
      EndTime: event.end_time,
      MaxCapacity: event.max_capacity,
      CurrentCount: event.current_count,
      Status: event.status,
      Type: event.type || 'Workshop',
      ImageURL: event.image_url,
      CreatedAt: event.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: transformedEvents,
    });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch events',
      },
      { status: 500 }
    );
  }
}

// POST /api/events - Create new event (admin only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Add Firebase Admin auth check
    // const authHeader = request.headers.get('authorization');
    // if (!authHeader) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // Verify token and check admin role

    const body = await request.json();
    const { Title, Description, StartTime, EndTime, MaxCapacity, ImageURL, Status, Type } = body;

    // Validation
    if (!Title || !Description || !StartTime || !EndTime || !MaxCapacity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const service = getSupabaseService();
    const newEvent = await service.createEvent({
      title: Title,
      description: Description,
      start_time: StartTime,
      end_time: EndTime,
      max_capacity: parseInt(MaxCapacity, 10),
      status: (Status || 'Open') as 'Open' | 'Full' | 'Closed' | 'Completed',
      type: Type || 'Workshop',
      image_url: ImageURL || '',
    });

    // Transform to match expected format (for backward compatibility with frontend)
    const transformedEvent = {
      ID: newEvent.id,
      Title: newEvent.title,
      Description: newEvent.description,
      StartTime: newEvent.start_time,
      EndTime: newEvent.end_time,
      MaxCapacity: newEvent.max_capacity,
      CurrentCount: newEvent.current_count,
      Status: newEvent.status,
      Type: newEvent.type || 'Workshop',
      ImageURL: newEvent.image_url,
      CreatedAt: newEvent.created_at,
    };

    return NextResponse.json({
      success: true,
      data: transformedEvent,
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create event',
      },
      { status: 500 }
    );
  }
}

