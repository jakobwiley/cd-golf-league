// Script to run the SQL file against the development database
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get environment variables for development database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log(`Creating MatchPoints table in development database: ${supabaseUrl}`);

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Read the SQL file
const sqlFilePath = path.join(__dirname, 'create-dev-match-points-table.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Split the SQL into individual statements
const statements = sqlContent
  .split(';')
  .map(statement => statement.trim())
  .filter(statement => statement.length > 0);

async function executeSQL() {
  try {
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement separately
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}:`);
      console.log(statement);
      
      try {
        // Use Supabase REST API to execute SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            sql: statement
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Error executing statement ${i + 1}:`, errorData);
          console.log('Continuing with next statement...');
        } else {
          console.log(`Statement ${i + 1} executed successfully`);
        }
      } catch (error) {
        console.error(`Error with statement ${i + 1}:`, error);
        console.log('Continuing with next statement...');
      }
    }
    
    // Verify the table was created
    console.log('Verifying MatchPoints table was created...');
    const { data, error } = await supabase
      .from('MatchPoints')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Error verifying table creation:', error);
      console.log('The table may not have been created successfully.');
    } else {
      console.log('✅ MatchPoints table created and verified successfully!');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

executeSQL()
  .then(() => {
    console.log('SQL execution complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script error:', err);
    process.exit(1);
  });
