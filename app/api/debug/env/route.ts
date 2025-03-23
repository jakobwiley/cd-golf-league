import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface DatabaseInfo {
  matches: number;
  firstMatchId: string | null;
}

export async function GET() {
  // Collect environment information
  const envInfo = {
    nodeEnv: process.env.NODE_ENV,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  };

  // Test Supabase connection
  let supabaseStatus = 'unknown';
  let supabaseError: string | null = null;
  let databaseInfo: DatabaseInfo | null = null;

  try {
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Test connection with a simple query
      const { data, error } = await supabase
        .from('Match')
        .select('id')
        .limit(1);
      
      if (error) {
        supabaseStatus = 'error';
        supabaseError = error.message;
      } else {
        supabaseStatus = 'connected';
        databaseInfo = {
          matches: data ? data.length : 0,
          firstMatchId: data && data.length > 0 ? data[0].id : null
        };
      }
    } else {
      supabaseStatus = 'missing_credentials';
    }
  } catch (error: any) {
    supabaseStatus = 'exception';
    supabaseError = error.message;
  }

  // Return debug information
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: envInfo,
    supabase: {
      status: supabaseStatus,
      error: supabaseError,
      databaseInfo
    }
  });
}
