// fix-edge-runtime.js
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

console.log('Starting Edge runtime fix process...');

// Function to check if a file contains fs/promises imports and edge runtime
async function checkAndFixFile(filePath) {
  try {
    const content = await readFileAsync(filePath, 'utf8');
    
    // Check if file contains both fs/promises import and edge runtime directive
    const hasFsPromises = content.includes('fs/promises');
    const hasEdgeRuntime = content.includes("export const runtime = 'edge'") || 
                          content.includes('export const runtime = "edge"');
    
    if (hasFsPromises && hasEdgeRuntime) {
      console.log(`Fixing Edge runtime issue in: ${filePath}`);
      
      // Remove the edge runtime directive
      const updatedContent = content.replace(/export\s+const\s+runtime\s*=\s*['"]edge['"];?\n?/g, '');
      
      // Write the updated content back to the file
      await writeFileAsync(filePath, updatedContent);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively scan directories for TypeScript files
async function scanDirectory(dirPath) {
  let fixedFiles = 0;
  
  try {
    const entries = await readdirAsync(dirPath);
    
    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry);
      const stats = await statAsync(entryPath);
      
      // Skip node_modules and .next directories
      if (entry === 'node_modules' || entry === '.next' || entry === '.git') {
        continue;
      }
      
      if (stats.isDirectory()) {
        // Recursively scan subdirectories
        fixedFiles += await scanDirectory(entryPath);
      } else if (stats.isFile() && (entry.endsWith('.ts') || entry.endsWith('.tsx'))) {
        // Check and fix TypeScript files
        const fixed = await checkAndFixFile(entryPath);
        if (fixed) fixedFiles++;
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
  
  return fixedFiles;
}

// Start the scan from the app directory
async function main() {
  try {
    const appDir = path.join(__dirname, '..', 'app');
    const fixedFiles = await scanDirectory(appDir);
    
    if (fixedFiles > 0) {
      console.log(`Fixed Edge runtime issues in ${fixedFiles} file(s)`);
    } else {
      console.log('No Edge runtime issues found');
    }
    
    console.log('Edge runtime fix process completed successfully');
  } catch (error) {
    console.error('Edge runtime fix process failed:', error.message);
    process.exit(1);
  }
}

main();
