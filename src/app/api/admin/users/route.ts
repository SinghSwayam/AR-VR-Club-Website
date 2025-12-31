/**
 * API Route: /api/admin/users
 * Get all users (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseService } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
  try {
    // TODO: Add Firebase Admin auth check
    const service = getSupabaseService();
    const users = await service.getAllUsers();

    // Transform to match expected format
    const transformedUsers = users.map(user => ({
      UserID: user.user_id,
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Year: user.year || '',
      Dept: user.dept || '',
      RollNo: user.roll_no || '',
      Designation: user.designation || '',
      MobileNumber: user.mobile_number || '',
      CreatedAt: user.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: transformedUsers,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch users',
      },
      { status: 500 }
    );
  }
}

