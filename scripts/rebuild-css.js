// rebuild-css.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting CSS rebuild process...');

try {
  // Ensure the CSS output directory exists
  const cssDir = path.join(__dirname, '..', '.next', 'static', 'css');
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
    console.log('Created CSS directory:', cssDir);
  }

  // Run the tailwind build to generate CSS
  console.log('Running Tailwind CSS build...');
  execSync('npx tailwindcss -i ./app/globals.css -o ./.next/static/css/app.css', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('CSS rebuild completed successfully');
} catch (error) {
  console.error('CSS rebuild failed:', error.message);
  process.exit(1);
}
