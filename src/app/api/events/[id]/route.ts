/**
 * API Route: /api/events/[id]
 * Handles PUT (update event) and DELETE (delete event) requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseService } from '@/lib/supabase/service';

// PUT /api/events/[id] - Update event (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add Firebase Admin auth check
    const eventId = params.id;
    const body = await request.json();
    const { Title, Description, StartTime, EndTime, MaxCapacity, ImageURL, Status } = body;

    // Validation
    if (!Title || !Description || !StartTime || !EndTime || !MaxCapacity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const service = getSupabaseService();
    const updatedEvent = await service.updateEvent(eventId, {
      title: Title,
      description: Description,
      start_time: StartTime,
      end_time: EndTime,
      max_capacity: parseInt(MaxCapacity, 10),
      status: (Status || 'Open') as 'Open' | 'Full' | 'Closed' | 'Completed',
      image_url: ImageURL || '',
    });

    // Transform to match expected format
    const transformedEvent = {
      ID: updatedEvent.id,
      Title: updatedEvent.title,
      Description: updatedEvent.description,
      StartTime: updatedEvent.start_time,
      EndTime: updatedEvent.end_time,
      MaxCapacity: updatedEvent.max_capacity,
      CurrentCount: updatedEvent.current_count,
      Status: updatedEvent.status,
      ImageURL: updatedEvent.image_url,
      CreatedAt: updatedEvent.created_at,
    };

    return NextResponse.json({
      success: true,
      data: transformedEvent,
    });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update event',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete event (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add Firebase Admin auth check
    const eventId = params.id;

    const service = getSupabaseService();
    await service.deleteEvent(eventId);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete event',
      },
      { status: 500 }
    );
  }
}

