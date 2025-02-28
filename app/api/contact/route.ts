import { NextResponse } from 'next/server';
import { submitContactForm } from '@/lib/services/contact';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    console.log('Processing contact form submission');
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    console.log('Form data:', { name, email, subject, messageLength: message?.length });
    
    // Validate input - subject is required
    if (!name || !email || !subject || !message) {
      console.log('Validation failed: Missing required fields');
      console.log('Name:', !!name, 'Email:', !!email, 'Subject:', !!subject, 'Message:', !!message);
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      );
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Submit to database
    console.log('Submitting to database');
    try {
      console.log('Calling submitContactForm with:', { name, email, subject, message: message.substring(0, 20) + '...' });
      await submitContactForm({ name, email, subject, message });
      console.log('Successfully submitted to database');
      
      const response = { 
        success: true,
        timestamp: new Date().toISOString()
      };
      console.log('Returning success response:', response);
      return NextResponse.json(response);
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Extract error details in a serializable format
      const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
      const errorDetails = dbError instanceof Error && (dbError as any).details 
        ? (dbError as any).details 
        : undefined;
      const errorCode = dbError instanceof Error && (dbError as any).code 
        ? (dbError as any).code 
        : undefined;
      
      return NextResponse.json(
        { 
          error: 'Database error while processing contact form', 
          message: errorMessage,
          details: errorDetails,
          code: errorCode
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process contact form', 
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 