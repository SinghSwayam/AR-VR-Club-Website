/**
 * API Route: /api/admin/members
 * Create new member (admin only)
 * Note: Creates member in database only. They can sign up later and the account will be linked by email.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseService } from '@/lib/supabase/service';
import { v4 as uuidv4 } from 'uuid';

// POST /api/admin/members - Create new member
export async function POST(request: NextRequest) {
  try {
    // TODO: Add Firebase Admin auth check
    const body = await request.json();
    const { Name, Email, Role, Year, Dept, Designation, MobileNumber } = body;

    // Validation
    if (!Name || !Email) {
      return NextResponse.json(
        { success: false, error: 'Name and Email are required' },
        { status: 400 }
      );
    }

    const service = getSupabaseService();
    
    // Check if user with this email already exists
    const existingUser = await service.getUserById(Email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'A member with this email already exists' },
        { status: 400 }
      );
    }

    // Generate a temporary user_id (will be updated when they sign up with Firebase)
    // Use a prefix to identify temporary IDs
    const tempUserId = `temp_${uuidv4()}`;

    const newUser = await service.createUser({
      user_id: tempUserId,
      name: Name,
      email: Email,
      role: (Role || 'student') as 'student' | 'admin',
      year: Year || '',
      dept: Dept || '',
      designation: Designation || '',
      mobile_number: MobileNumber || '',
    });

    // Transform to match expected format
    const transformedUser = {
      UserID: newUser.user_id,
      Name: newUser.name,
      Email: newUser.email,
      Role: newUser.role,
      Year: newUser.year,
      Dept: newUser.dept,
      Designation: newUser.designation,
      MobileNumber: newUser.mobile_number,
      CreatedAt: newUser.created_at,
    };

    return NextResponse.json({
      success: true,
      data: transformedUser,
      message: 'Member added successfully. They can sign up later and their account will be linked by email.',
    });
  } catch (error: any) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create member',
      },
      { status: 500 }
    );
  }
}

