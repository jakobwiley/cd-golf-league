import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET(req: NextRequest) {
  try {
    console.log('Checking MatchPoints table...');
    
    // Check if the table exists using a more reliable method
    try {
      // Try to query the table directly - if it doesn't exist, this will throw an error
      const { data, error } = await supabase
        .from('MatchPoints')
        .select('id')
        .limit(1);
      
      if (error) {
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.log('MatchPoints table does not exist');
          return NextResponse.json({ 
            exists: false,
            message: 'MatchPoints table does not exist',
            error: error.message
          }, { status: 404 });
        } else {
          console.error('Error checking MatchPoints table:', error);
          return NextResponse.json({ 
            exists: false,
            message: 'Error checking MatchPoints table',
            error: error.message
          }, { status: 500 });
        }
      }
      
      console.log('MatchPoints table exists, checking structure...');
      
      // Table exists, return success
      return NextResponse.json({ 
        exists: true,
        message: 'MatchPoints table exists',
        columns: [
          'id', 'matchId', 'teamId', 'hole', 
          'homePoints', 'awayPoints', 'points', 
          'createdAt', 'updatedAt'
        ]
      }, { status: 200 });
      
    } catch (error: any) {
      console.error('Unexpected error checking table:', error);
      return NextResponse.json({ 
        exists: false,
        message: 'Error checking MatchPoints table',
        error: error.message || 'Unknown error'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error.message || {} 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // This endpoint doesn't actually create the table anymore
    // It just returns information about whether it exists
    
    return NextResponse.json({ 
      message: 'Table creation via API is disabled for security reasons. Please create the table manually using the Supabase dashboard.',
      instructions: 'Use the SQL in create-match-points-table.sql to create the table'
    }, { status: 403 });
    
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error.message || {} 
    }, { status: 500 });
  }
}
