import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Test connection by fetching a simple query
    const { data, error } = await supabase
      .from('Match')
      .select('id, homeTeamId, awayTeamId')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Supabase connection failed',
        error: error.message,
        details: error,
        config: {
          supabaseUrl: supabaseUrl || 'Not set',
          supabaseKeyProvided: !!supabaseKey,
          environment: process.env.NODE_ENV,
        }
      }, { status: 500 });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      data,
      config: {
        supabaseUrl: supabaseUrl || 'Not set',
        supabaseKeyProvided: !!supabaseKey,
        environment: process.env.NODE_ENV,
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Server error',
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
