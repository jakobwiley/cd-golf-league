// Script to update environment variables
const fs = require('fs');
const path = require('path');

// Path to .env.local file
const envPath = path.join(__dirname, '.env.local');

// Required environment variables
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://gyvaalhcjrwozinpilsw.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dmFhbGhjanJ3b3ppbnBpbHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2OTE1NjAsImV4cCI6MjA1ODI2NzU2MH0.c5GF8A1ZVWH__KGUsBpXmOBT_8p0L98JzPCFpkYm4qo',
  SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dmFhbGhjanJ3b3ppbnBpbHN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjY5MTU2MCwiZXhwIjoyMDU4MjY3NTYwfQ.ZdDpqhTjXfnH3cm2oH9QDHDBpg0CFfiYDvmLW2g9iaE'
};

// Check if .env.local exists
if (fs.existsSync(envPath)) {
  // Read existing file
  let envContent = fs.readFileSync(envPath, 'utf8');
  let envVars = {};
  
  // Parse existing variables
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      if (key) {
        envVars[key.trim()] = value.trim();
      }
    }
  });
  
  // Update variables
  let updated = false;
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (envVars[key] !== value) {
      envVars[key] = value;
      updated = true;
      console.log(`Updated ${key}`);
    } else {
      console.log(`${key} is already correct`);
    }
  });
  
  if (updated) {
    // Write updated content
    const newContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync(envPath, newContent);
    console.log('.env.local has been updated');
  } else {
    console.log('No changes needed to .env.local');
  }
} else {
  // Create new file
  const newContent = Object.entries(requiredEnvVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(envPath, newContent);
  console.log('.env.local has been created');
}

console.log('Environment variables are now properly configured');
