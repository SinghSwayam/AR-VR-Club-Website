/**
 * API Route: /api/users/[id]
 * Handles PUT (update user) and DELETE (delete user) requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseService } from '@/lib/supabase/service';

// PUT /api/users/[id] - Update user (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add Firebase Admin auth check
    const userId = params.id;
    const body = await request.json();
    const { Name, Email, Role, Year, Dept, RollNo, Designation, MobileNumber } = body;

    // Validation
    if (!Name || !Email) {
      return NextResponse.json(
        { success: false, error: 'Name and Email are required' },
        { status: 400 }
      );
    }

    const service = getSupabaseService();
    const updatedUser = await service.updateUser(userId, {
      name: Name,
      email: Email,
      role: (Role || 'student') as 'student' | 'admin',
      year: Year || '',
      dept: Dept || '',
      roll_no: RollNo || '',
      designation: Designation || '',
      mobile_number: MobileNumber || '',
    });

    // Transform to match expected format
    const transformedUser = {
      UserID: updatedUser.user_id,
      Name: updatedUser.name,
      Email: updatedUser.email,
      Role: updatedUser.role,
      Year: updatedUser.year,
      Dept: updatedUser.dept,
      RollNo: updatedUser.roll_no,
      Designation: updatedUser.designation,
      MobileNumber: updatedUser.mobile_number,
      CreatedAt: updatedUser.created_at,
    };

    return NextResponse.json({
      success: true,
      data: transformedUser,
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update user',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add Firebase Admin auth check
    const userId = params.id;

    const service = getSupabaseService();

    // Check if user has registrations
    const { supabaseAdmin } = await import('@/lib/supabase/client');
    const { data: registrations } = await supabaseAdmin
      .from('registrations')
      .select('registration_id')
      .eq('user_id', userId)
      .limit(1);

    if (registrations && registrations.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete user: User has event registrations. Delete registrations first or the user will be automatically deleted when their registrations are removed.',
        },
        { status: 400 }
      );
    }

    // Delete user (CASCADE should handle registrations, but we check above for better UX)
    await supabaseAdmin
      .from('users')
      .delete()
      .eq('user_id', userId);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete user',
      },
      { status: 500 }
    );
  }
}

