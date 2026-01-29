/**
 * API Route: /api/admin/inquiries
 * Get all inquiries (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// FIX: Force dynamic rendering to bypass Vercel Data Cache
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// GET /api/admin/inquiries - Get all inquiries
export async function GET(request: NextRequest) {
  try {
    const { data: inquiries, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inquiries:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to fetch inquiries',
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: inquiries || [],
    });

    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

    return response;
  } catch (error: any) {
    console.error('Error in inquiries API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch inquiries',
      },
      { status: 500 }
    );
  }
}