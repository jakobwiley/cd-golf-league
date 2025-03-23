import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test database connection
  let dbConnectionStatus = 'unknown';
  let matchPointsColumns = [];
  
  try {
    // Check if we can connect to the database
    const { data, error } = await supabase.from('Match').select('id').limit(1);
    
    if (error) {
      dbConnectionStatus = `error: ${error.message}`;
    } else {
      dbConnectionStatus = 'connected';
      
      // Check MatchPoints table structure
      const { data: columns, error: columnsError } = await supabase
        .from('MatchPoints')
        .select('*')
        .limit(1);
      
      if (columnsError) {
        matchPointsColumns = [`error: ${columnsError.message}`];
      } else if (columns && columns.length > 0) {
        matchPointsColumns = Object.keys(columns[0]);
      } else {
        // Try to get columns even if no data exists
        const { data: emptyResult, error: insertError } = await supabase
          .from('MatchPoints')
          .insert({
            id: crypto.randomUUID(),
            matchId: data?.[0]?.id || 'test',
            teamId: 'test',
            points: 0,
            homePoints: 0,
            awayPoints: 0,
            hole: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          .select()
          .single();
        
        if (!insertError && emptyResult) {
          matchPointsColumns = Object.keys(emptyResult);
          
          // Clean up test record
          await supabase
            .from('MatchPoints')
            .delete()
            .eq('id', emptyResult.id);
        } else {
          matchPointsColumns = [`No data, insert error: ${insertError?.message || 'unknown'}`];
        }
      }
    }
  } catch (e) {
    dbConnectionStatus = `exception: ${e instanceof Error ? e.message : String(e)}`;
  }
  
  return NextResponse.json({
    environment: {
      vercelEnv: process.env.VERCEL_ENV || 'local',
      nodeEnv: process.env.NODE_ENV,
      host: process.env.VERCEL_URL || 'localhost'
    },
    supabase: {
      url: supabaseUrl,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      connectionStatus: dbConnectionStatus
    },
    matchPointsTable: {
      columns: matchPointsColumns
    }
  });
}
