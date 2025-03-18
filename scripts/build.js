// build.js
const { execSync } = require('child_process');
const https = require('https');

console.log('Starting custom build process...');

// Set environment variables
process.env.CI = 'false';
console.log('Set CI to false');

try {
  // Run the Next.js build
  console.log('Running Next.js build...');
  execSync('next build', { stdio: 'inherit' });
  console.log('Build completed successfully');

  // Call the force-setup endpoint
  if (process.env.VERCEL_ENV === 'production') {
    console.log('Running force-setup in production...');
    const options = {
      hostname: 'cd-golf-league-2025-d9u4f9li5-jakes-projects-9070cd0b.vercel.app',
      port: 443,
      path: '/api/force-setup',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      console.log(`Force setup status code: ${res.statusCode}`);
      res.on('data', (d) => {
        console.log('Force setup response:', d.toString());
      });
    });

    req.on('error', (error) => {
      console.error('Error in force setup:', error);
    });

    req.end();
  }
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}