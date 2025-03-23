import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    // Check if the MatchPoints table exists
    console.log('Checking if MatchPoints table exists...');
    const { data: testData, error: testError } = await supabase
      .from('MatchPoints')
      .select('*')
      .limit(1);
    
    if (testError) {
      if (testError.code === '42P01') { // relation does not exist
        console.log('MatchPoints table does not exist. Creating it...');
        
        // Create the table with the correct structure using a stored procedure
        const { error: rpcError } = await supabase.rpc('create_match_points_table');
        
        if (rpcError) {
          return NextResponse.json({ 
            error: 'Failed to create MatchPoints table', 
            details: rpcError 
          }, { status: 500 });
        }
        
        return NextResponse.json({ 
          message: 'MatchPoints table created successfully' 
        });
      } else {
        return NextResponse.json({ 
          error: 'Error checking MatchPoints table', 
          details: testError 
        }, { status: 500 });
      }
    }
    
    // If we get here, the table exists but might have the wrong structure
    // Let's try to recreate it
    
    // First, get all existing data to preserve it if possible
    const { data: existingData, error: dataError } = await supabase
      .from('MatchPoints')
      .select('*');
    
    if (dataError) {
      return NextResponse.json({ 
        error: 'Error fetching existing data', 
        details: dataError 
      }, { status: 500 });
    }
    
    console.log(`Found ${existingData?.length || 0} existing records`);
    
    // Now try to drop and recreate the table using a stored procedure
    const { error: dropError } = await supabase.rpc('drop_match_points_table');
    
    if (dropError) {
      return NextResponse.json({ 
        error: 'Failed to drop MatchPoints table', 
        details: dropError 
      }, { status: 500 });
    }
    
    const { error: createError } = await supabase.rpc('create_match_points_table');
    
    if (createError) {
      return NextResponse.json({ 
        error: 'Failed to recreate MatchPoints table', 
        details: createError 
      }, { status: 500 });
    }
    
    // Test the table structure by inserting a record
    const { error: insertError } = await supabase
      .from('MatchPoints')
      .insert({
        id: randomUUID(),
        matchId: 'd0b585dd-09e4-4171-b133-2f5376bcc59a', // Use an existing match ID
        hole: null,
        homePoints: 0,
        awayPoints: 0
      });
    
    if (insertError) {
      return NextResponse.json({ 
        error: 'Table structure is still incorrect', 
        details: insertError 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'MatchPoints table structure fixed successfully',
      existingRecords: existingData?.length || 0
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error 
    }, { status: 500 });
  }
}
