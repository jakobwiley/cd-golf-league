import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    // Create the stored procedure
    const { error } = await supabase.rpc('create_stored_procedures');
    
    if (error) {
      // If the procedure doesn't exist, create it first
      if (error.code === 'PGRST202') {
        console.log('Creating create_stored_procedures function...');
        
        // Create the function that will create our other functions
        const { error: createError } = await supabase
          .from('_sqlj')
          .insert({
            name: 'create_stored_procedures',
            code: `
              CREATE OR REPLACE FUNCTION create_simple_match_points(match_id uuid)
              RETURNS void
              LANGUAGE plpgsql
              SECURITY DEFINER
              AS $$
              BEGIN
                -- Create the MatchPoints table if it doesn't exist
                CREATE TABLE IF NOT EXISTS "MatchPoints" (
                  id UUID PRIMARY KEY,
                  "matchId" UUID NOT NULL REFERENCES "Match"(id) ON DELETE CASCADE,
                  hole INTEGER,
                  points JSONB,
                  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                  UNIQUE("matchId", hole)
                );
              END;
              $$;
            `
          });
        
        if (createError) {
          return NextResponse.json({ 
            error: 'Failed to create stored procedure', 
            details: createError 
          }, { status: 500 });
        }
        
        // Now try to call it
        const { error: callError } = await supabase.rpc('create_stored_procedures');
        
        if (callError) {
          return NextResponse.json({ 
            error: 'Failed to call stored procedure', 
            details: callError 
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({ 
          error: 'Failed to call stored procedure', 
          details: error 
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      message: 'Stored procedures created successfully' 
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error 
    }, { status: 500 });
  }
}
