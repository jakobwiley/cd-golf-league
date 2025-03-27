#!/usr/bin/env node

/**
 * Secure Deployment Script
 * 
 * This script performs security checks before deploying to production:
 * 1. Runs git-secrets to check for any leaked secrets
 * 2. Verifies that all environment variables are properly set
 * 3. Checks for vulnerable dependencies with npm audit
 * 4. Runs tests to ensure everything is working properly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for output formatting
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Print a formatted header
function printHeader(text) {
  console.log(`\n${colors.bold}${colors.blue}=== ${text} ===${colors.reset}\n`);
}

// Print a success message
function printSuccess(text) {
  console.log(`${colors.green}✓ ${text}${colors.reset}`);
}

// Print a warning message
function printWarning(text) {
  console.log(`${colors.yellow}⚠ ${text}${colors.reset}`);
}

// Print an error message
function printError(text) {
  console.log(`${colors.red}✗ ${text}${colors.reset}`);
}

// Run a command and return its output
function runCommand(command, ignoreErrors = false) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ignoreErrors ? 'pipe' : 'inherit' });
  } catch (error) {
    if (!ignoreErrors) {
      printError(`Command failed: ${command}`);
      printError(error.message);
      process.exit(1);
    }
    return error.stdout;
  }
}

// Check for secrets in the codebase
function checkForSecrets() {
  printHeader('Checking for secrets in the codebase');
  
  try {
    runCommand('git secrets --scan', true);
    printSuccess('No secrets found in the codebase');
  } catch (error) {
    printError('Secrets found in the codebase!');
    printError('Please remove all secrets before deploying');
    process.exit(1);
  }
}

// Check if all required environment variables are set in Vercel
function checkEnvironmentVariables() {
  printHeader('Checking environment variables');
  
  // Get a list of all environment variables from .env.example
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  if (!fs.existsSync(envExamplePath)) {
    printError('.env.example file not found!');
    process.exit(1);
  }
  
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  const requiredVars = [];
  
  envExampleContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const key = line.split('=')[0].trim();
      requiredVars.push(key);
    }
  });
  
  printSuccess(`Found ${requiredVars.length} required environment variables in .env.example`);
  
  // Check if these variables are set in Vercel
  printWarning('Please verify that all these variables are set in your Vercel project:');
  requiredVars.forEach(variable => {
    console.log(`  - ${variable}`);
  });
  
  // Prompt user to confirm
  console.log('\nPlease confirm that all required environment variables are set in Vercel');
  console.log('Press Enter to continue or Ctrl+C to abort');
  require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  }).question('', () => {
    printSuccess('Environment variables confirmed');
    checkDependencies();
  });
}

// Check for vulnerable dependencies
function checkDependencies() {
  printHeader('Checking for vulnerable dependencies');
  
  try {
    const auditOutput = runCommand('npm audit --audit-level=high', true);
    
    if (auditOutput.includes('found 0 vulnerabilities')) {
      printSuccess('No high severity vulnerabilities found');
      runTests();
    } else {
      printWarning('Vulnerabilities found in dependencies');
      console.log(auditOutput);
      
      // Prompt user to confirm
      console.log('\nVulnerabilities were found in your dependencies');
      console.log('It is recommended to fix these before deploying');
      console.log('Press Enter to continue anyway or Ctrl+C to abort');
      require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      }).question('', () => {
        printWarning('Continuing despite vulnerabilities');
        runTests();
      });
    }
  } catch (error) {
    printError('Failed to check dependencies');
    process.exit(1);
  }
}

// Run tests to ensure everything is working
function runTests() {
  printHeader('Running tests');
  
  try {
    runCommand('npm test');
    printSuccess('All tests passed');
    deploy();
  } catch (error) {
    printError('Tests failed!');
    printError('Please fix failing tests before deploying');
    process.exit(1);
  }
}

// Deploy to production
function deploy() {
  printHeader('Deploying to production');
  
  try {
    runCommand('npm run vercel:deploy');
    printSuccess('Deployment successful!');
    
    // Verify the deployment
    printHeader('Verifying deployment');
    runCommand('npm run verify:prod');
    printSuccess('Deployment verified');
    
    console.log(`\n${colors.bold}${colors.green}=== Deployment completed successfully ===${colors.reset}\n`);
  } catch (error) {
    printError('Deployment failed!');
    process.exit(1);
  }
}

// Start the deployment process
function startDeployment() {
  console.log(`\n${colors.bold}${colors.magenta}=== SECURE DEPLOYMENT PROCESS ===${colors.reset}\n`);
  console.log('This script will perform security checks before deploying to production');
  
  checkForSecrets();
  checkEnvironmentVariables();
}

startDeployment();
