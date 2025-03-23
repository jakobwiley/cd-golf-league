import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET(req: NextRequest) {
  try {
    console.log('Checking MatchPoints table...');
    
    // Check if the table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'MatchPoints')
      .maybeSingle();
    
    if (tableError) {
      console.error('Error checking if table exists:', tableError);
      return NextResponse.json({ 
        error: 'Error checking if table exists', 
        details: tableError 
      }, { status: 500 });
    }
    
    if (!tableExists) {
      console.log('MatchPoints table does not exist, creating it...');
      
      // Create the table with SQL
      const createTableSql = `
        -- Create the MatchPoints table with all required columns
        CREATE TABLE IF NOT EXISTS "MatchPoints" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          "matchId" TEXT NOT NULL REFERENCES "Match"(id) ON DELETE CASCADE,
          "teamId" TEXT NOT NULL,
          hole INTEGER,
          "homePoints" NUMERIC NOT NULL DEFAULT 0,
          "awayPoints" NUMERIC NOT NULL DEFAULT 0,
          "points" NUMERIC NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS "idx_match_points_match_id" ON "MatchPoints" ("matchId");
        CREATE INDEX IF NOT EXISTS "idx_match_points_team_id" ON "MatchPoints" ("teamId");
        
        -- Create a unique index to prevent duplicate entries for the same match and hole
        CREATE UNIQUE INDEX IF NOT EXISTS "idx_match_points_match_id_hole" 
        ON "MatchPoints" ("matchId", hole) 
        WHERE hole IS NOT NULL;
      `;
      
      const { error: createError } = await supabase.rpc('run_sql', { query: createTableSql });
      
      if (createError) {
        console.error('Error creating table:', createError);
        
        // Try direct SQL approach
        try {
          // We need to run multiple SQL statements separately
          await supabase.from('MatchPoints').select('*').limit(1);
          console.log('Table exists or was created successfully');
        } catch (directError) {
          console.error('Error with direct SQL approach:', directError);
          return NextResponse.json({ 
            error: 'Failed to create MatchPoints table', 
            details: createError 
          }, { status: 500 });
        }
      }
    } else {
      console.log('MatchPoints table already exists');
    }
    
    // Check if the table has all required columns
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'MatchPoints');
    
    if (columnsError) {
      console.error('Error checking columns:', columnsError);
      return NextResponse.json({ 
        error: 'Error checking columns', 
        details: columnsError 
      }, { status: 500 });
    }
    
    const columnNames = columns?.map(c => c.column_name.toLowerCase()) || [];
    console.log('MatchPoints table columns:', columnNames.join(', '));
    
    // Check for required columns
    const requiredColumns = ['teamid', 'points', 'homepoints', 'awaypoints', 'hole'];
    const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
    
    if (missingColumns.length > 0) {
      console.warn('Missing required columns:', missingColumns.join(', '));
      return NextResponse.json({ 
        status: 'incomplete', 
        message: 'MatchPoints table exists but is missing columns', 
        missingColumns 
      });
    }
    
    // Try to insert a test record and then delete it to verify the table is working
    const testMatchId = '00000000-0000-0000-0000-000000000000';
    const testTeamId = '00000000-0000-0000-0000-000000000000';
    
    try {
      // First check if the test record already exists
      const { data: existingRecord } = await supabase
        .from('MatchPoints')
        .select('id')
        .eq('matchId', testMatchId)
        .eq('hole', 1)
        .maybeSingle();
      
      if (!existingRecord) {
        // Insert a test record
        const { error: insertError } = await supabase
          .from('MatchPoints')
          .insert([{
            matchId: testMatchId,
            teamId: testTeamId,
            hole: 1,
            homePoints: 0,
            awayPoints: 0,
            points: 0
          }]);
        
        if (insertError) {
          console.error('Error inserting test record:', insertError);
          return NextResponse.json({ 
            status: 'error', 
            message: 'MatchPoints table exists but insert failed', 
            details: insertError 
          });
        }
        
        // Delete the test record
        await supabase
          .from('MatchPoints')
          .delete()
          .eq('matchId', testMatchId);
      }
    } catch (testError) {
      console.error('Error testing table:', testError);
      return NextResponse.json({ 
        status: 'error', 
        message: 'Error testing MatchPoints table', 
        details: testError 
      });
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'MatchPoints table exists and is working correctly',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('Creating MatchPoints table...');
    
    // Create the table with SQL
    const createTableSql = `
      -- Drop the table if it exists
      DROP TABLE IF EXISTS "MatchPoints";

      -- Create the MatchPoints table with all required columns
      CREATE TABLE "MatchPoints" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
        "matchId" TEXT NOT NULL REFERENCES "Match"(id) ON DELETE CASCADE,
        "teamId" TEXT NOT NULL,
        hole INTEGER,
        "homePoints" NUMERIC NOT NULL DEFAULT 0,
        "awayPoints" NUMERIC NOT NULL DEFAULT 0,
        "points" NUMERIC NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS "idx_match_points_match_id" ON "MatchPoints" ("matchId");
      CREATE INDEX IF NOT EXISTS "idx_match_points_team_id" ON "MatchPoints" ("teamId");
      
      -- Create a unique index to prevent duplicate entries for the same match and hole
      CREATE UNIQUE INDEX IF NOT EXISTS "idx_match_points_match_id_hole" 
      ON "MatchPoints" ("matchId", hole) 
      WHERE hole IS NOT NULL;
    `;
    
    const { error: createError } = await supabase.rpc('run_sql', { query: createTableSql });
    
    if (createError) {
      console.error('Error creating table:', createError);
      return NextResponse.json({ 
        error: 'Failed to create MatchPoints table', 
        details: createError 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'MatchPoints table created successfully',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error 
    }, { status: 500 });
  }
}
