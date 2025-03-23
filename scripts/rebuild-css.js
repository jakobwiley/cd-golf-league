// rebuild-css.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting CSS rebuild process...');

try {
  // Clean the CSS cache directory if it exists, but backup any custom CSS files first
  const cssDir = path.join(__dirname, '..', '.next', 'static', 'css');
  const publicCssDir = path.join(__dirname, '..', 'public', 'css');
  
  // Ensure public CSS directory exists
  if (!fs.existsSync(publicCssDir)) {
    fs.mkdirSync(publicCssDir, { recursive: true });
  }
  
  // Clean Next.js cache to ensure fresh build, but be more selective
  console.log('Cleaning Next.js cache...');
  const cacheDir = path.join(__dirname, '..', '.next', 'cache');
  if (fs.existsSync(cacheDir)) {
    // Only remove the webpack and swc cache, preserve other caches
    const webpackCacheDir = path.join(cacheDir, 'webpack');
    if (fs.existsSync(webpackCacheDir)) {
      fs.rmSync(webpackCacheDir, { recursive: true, force: true });
    }
    
    const swcCacheDir = path.join(cacheDir, 'swc');
    if (fs.existsSync(swcCacheDir)) {
      fs.rmSync(swcCacheDir, { recursive: true, force: true });
    }
  }
  
  // Create CSS directory if it doesn't exist
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }
  console.log('CSS directory ready:', cssDir);

  // Run the tailwind build with production settings to include all classes
  console.log('Running Tailwind CSS build...');
  execSync('NODE_ENV=production npx tailwindcss -i ./app/globals.css -o ./.next/static/css/app.css --minify', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  // Copy the generated CSS to the public directory for fallback access
  fs.copyFileSync(
    path.join(cssDir, 'app.css'), 
    path.join(publicCssDir, 'app.css')
  );
  
  // Create a backup of the current app.css in case we need to revert
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.copyFileSync(
    path.join(publicCssDir, 'app.css'),
    path.join(publicCssDir, `app-backup-${timestamp}.css`)
  );
  
  console.log('CSS rebuild completed successfully');
} catch (error) {
  console.error('CSS rebuild failed:', error.message);
  process.exit(1);
}
