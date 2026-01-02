/**
 * API Route: /api/admin/registrations
 * Get all registrations with event information (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseService } from '@/lib/supabase/service';
import { supabaseAdmin } from '@/lib/supabase/client';

// FIX: Force dynamic rendering to bypass Vercel Data Cache
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// GET /api/admin/registrations - Get all registrations with event details
export async function GET(request: NextRequest) {
  try {
    const service = getSupabaseService();
    
    // Get all registrations
    const registrations = await service.getAllRegistrations();
    
    if (registrations.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Get event details for all registrations
    const eventIds = registrations.map(reg => reg.event_id);
    const { data: events, error: eventsError } = await supabaseAdmin
      .from('events')
      .select('id, title, start_time')
      .in('id', eventIds);

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
    }

    // Combine registrations with event data
    const registrationsWithEvents = registrations.map(reg => {
      const event = events?.find((e: any) => e.id === reg.event_id);
      return {
        registration_id: reg.registration_id,
        event_id: reg.event_id,
        user_id: reg.user_id,
        user_email: reg.user_email,
        year: reg.year,
        dept: reg.dept,
        roll_no: reg.roll_no,
        mobile_number: reg.mobile_number,
        timestamp: reg.timestamp,
        status: reg.status,
        event_title: event?.title || 'Unknown Event',
        event_start_time: event?.start_time || '',
      };
    });

    const response = NextResponse.json({
      success: true,
      data: registrationsWithEvents,
    });
    
    // Prevent caching headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch registrations',
      },
      { status: 500 }
    );
  }
}