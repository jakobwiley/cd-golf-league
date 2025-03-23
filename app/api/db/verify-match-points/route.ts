import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Helper function to add CORS headers
function addCorsHeaders(response: Response): Response {
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return newResponse;
}

export async function OPTIONS() {
  return addCorsHeaders(
    new Response(null, {
      status: 204,
    })
  );
}

export async function GET() {
  try {
    // Use service role for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return addCorsHeaders(
        NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if MatchPoints table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('MatchPoints')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.error('Error checking if MatchPoints table exists:', tableError);
      return addCorsHeaders(
        NextResponse.json({ 
          success: false, 
          error: tableError.message,
          details: 'Error checking if MatchPoints table exists'
        }, { status: 500 })
      );
    }
    
    // Get column information
    let columnInfo = null;
    try {
      const { data: columns, error: columnsError } = await supabase
        .from('MatchPoints')
        .select('*')
        .limit(1);
      
      if (columns && columns.length > 0) {
        columnInfo = Object.keys(columns[0]);
      } else if (!columnsError) {
        // No data but table exists, try to get column names from an empty insert
        const { data: emptyData, error: emptyError } = await supabase
          .from('MatchPoints')
          .select('id, matchId, teamId, hole, homePoints, awayPoints, points, createdAt, updatedAt')
          .limit(0);
        
        if (!emptyError) {
          columnInfo = emptyData ? Object.keys(emptyData) : [];
        }
      }
    } catch (columnsError) {
      console.error('Error getting column information:', columnsError);
    }
    
    // Try to insert a test record
    let insertResult = null;
    let deleteResult = null;
    
    try {
      const testMatchId = 'test-match-id';
      const testTeamId = 'test-team-id';
      
      const { data: insertData, error: insertError } = await supabase
        .from('MatchPoints')
        .insert({
          matchId: testMatchId,
          teamId: testTeamId,
          hole: 999, // Use a high number to avoid conflicts
          homePoints: 0,
          awayPoints: 0,
          points: 0
        })
        .select();
      
      insertResult = {
        success: !insertError,
        data: insertData,
        error: insertError ? insertError.message : null
      };
      
      if (!insertError && insertData) {
        // Delete the test record
        const { error: deleteError } = await supabase
          .from('MatchPoints')
          .delete()
          .eq('hole', 999)
          .eq('matchId', testMatchId);
        
        deleteResult = {
          success: !deleteError,
          error: deleteError ? deleteError.message : null
        };
      }
    } catch (testError) {
      console.error('Error during test insert/delete:', testError);
      insertResult = { success: false, error: 'Error during test operations' };
    }
    
    // Return the results
    return addCorsHeaders(
      NextResponse.json({
        success: true,
        tableExists: !!tableExists,
        columnInfo,
        insertTest: insertResult,
        deleteTest: deleteResult,
        environment: {
          nodeEnv: process.env.NODE_ENV,
          vercelEnv: process.env.VERCEL_ENV,
          supabaseUrl: supabaseUrl
        }
      })
    );
  } catch (error) {
    console.error('Unexpected error in verify-match-points API:', error);
    return addCorsHeaders(
      NextResponse.json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : null) : null
      }, { status: 500 })
    );
  }
}
