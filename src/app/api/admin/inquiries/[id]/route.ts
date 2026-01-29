/**
 * API Route: /api/admin/inquiries/[id]
 * Update inquiry status (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// PUT /api/admin/inquiries/[id] - Update inquiry status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add Firebase Admin auth check
    const inquiryId = params.id;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['pending', 'read', 'replied', 'resolved'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be one of: pending, read, replied, resolved' },
        { status: 400 }
      );
    }

    const { data: updatedInquiry, error } = await supabaseAdmin
      .from('inquiries')
      .update({ status })
      .eq('id', inquiryId)
      .select()
      .single();

    if (error) {
      console.error('Error updating inquiry:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to update inquiry',
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: updatedInquiry,
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

    return response;
  } catch (error: any) {
    console.error('Error in update inquiry API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update inquiry',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/inquiries/[id] - Delete inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add Firebase Admin auth check
    const inquiryId = params.id;

    const { error } = await supabaseAdmin
      .from('inquiries')
      .delete()
      .eq('id', inquiryId);

    if (error) {
      console.error('Error deleting inquiry:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to delete inquiry',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error: any) {
    console.error('Error in delete inquiry API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete inquiry',
      },
      { status: 500 }
    );
  }
}

