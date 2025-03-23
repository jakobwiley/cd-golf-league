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
      
      console.log('MatchPoints table exists, checking columns...');
      
      // If we get here, the table exists, now check columns
      const { data: columns, error: columnsError } = await supabase
        .from('MatchPoints')
        .select('*')
        .limit(0);
      
      if (columnsError) {
        console.error('Error checking columns:', columnsError);
        return NextResponse.json({ 
          error: 'Error checking columns', 
          details: columnsError 
        }, { status: 500 });
      }
      
      // Get column names from the returned data
      const columnNames = columns ? Object.keys(columns[0] || {}) : [];
      if (columnNames.length === 0 && !error) {
        // If no error but no columns, try to get column info from metadata
        try {
          const { data: metadata } = await supabase.rpc('get_table_info', { table_name: 'MatchPoints' });
          if (metadata) {
            console.log('Got column info from metadata:', metadata);
          }
        } catch (metadataError) {
          console.error('Error getting table metadata:', metadataError);
        }
      }
      
      console.log('MatchPoints table columns:', columnNames.join(', '));
      
      // Check for required columns
      const requiredColumns = ['teamid', 'points', 'homepoints', 'awaypoints', 'hole'].map(c => c.toLowerCase());
      const availableColumns = columnNames.map(c => c.toLowerCase());
      const missingColumns = requiredColumns.filter(col => !availableColumns.includes(col));
      
      if (missingColumns.length > 0) {
        console.warn('Missing required columns:', missingColumns.join(', '));
        // Create missing columns
        await createOrUpdateTable();
        return NextResponse.json({ 
          status: 'updated', 
          message: 'MatchPoints table updated with missing columns', 
          missingColumns 
        });
      }
      
      return NextResponse.json({ 
        status: 'success', 
        message: 'MatchPoints table exists and has all required columns',
        columns: columnNames,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      });
      
    } catch (tableError) {
      // If we get an error, the table likely doesn't exist
      console.log('MatchPoints table does not exist, creating it...');
      await createOrUpdateTable();
      
      return NextResponse.json({ 
        status: 'created', 
        message: 'MatchPoints table created successfully',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error 
    }, { status: 500 });
  }
}

// Helper function to create or update the MatchPoints table
async function createOrUpdateTable() {
  // Create the table with SQL
  const createTableSql = `
    -- Create the MatchPoints table with all required columns if it doesn't exist
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
  
  try {
    // Try using RPC to run SQL
    const { error: createError } = await supabase.rpc('run_sql', { query: createTableSql });
    
    if (createError) {
      console.error('Error using RPC to create table:', createError);
      throw createError;
    }
    
    console.log('Table created or updated successfully via RPC');
    return true;
  } catch (rpcError) {
    console.error('RPC error, trying direct SQL execution:', rpcError);
    
    // If RPC fails, try direct SQL execution through a POST request
    try {
      const response = await fetch('/api/admin/fix-tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ force: true })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error with direct SQL execution:', errorData);
        throw new Error('Failed to create table via direct SQL');
      }
      
      console.log('Table created or updated successfully via direct SQL');
      return true;
    } catch (directError) {
      console.error('All table creation attempts failed:', directError);
      throw directError;
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('Force creating/updating MatchPoints table...');
    await createOrUpdateTable();
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'MatchPoints table created or updated successfully',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    });
  } catch (error) {
    console.error('Error creating/updating table:', error);
    return NextResponse.json({ 
      error: 'Failed to create or update MatchPoints table', 
      details: error 
    }, { status: 500 });
  }
}
