/**
 * API Route: /api/contact
 * Handles POST requests for contact form submissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required. Please fill in your name, email, and message.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Message must be at least 10 characters long.' },
        { status: 400 }
      );
    }

    // Save inquiry to Supabase
    const { data: inquiry, error: dbError } = await supabaseAdmin
      .from('inquiries')
      .insert({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error saving inquiry to database:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save your inquiry. Please try again later.',
        },
        { status: 500 }
      );
    }

    console.log('Inquiry saved successfully:', inquiry.id);

    const response = NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
    });

    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

    return response;
  } catch (error: any) {
    console.error('Error processing contact form:', error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format. Please try again.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to submit contact form. Please try again later.',
      },
      { status: 500 }
    );
  }
}

