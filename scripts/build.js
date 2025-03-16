// build.js
const { execSync } = require('child_process');

console.log('Starting custom build process...');

// Set environment variables
process.env.CI = 'false';
console.log('Set CI to false');

try {
  // Run the Next.js build
  console.log('Running Next.js build...');
  execSync('next build', { stdio: 'inherit' });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 