#!/usr/bin/env node

/**
 * Environment Setup Script
 * 
 * This script helps set up environment variables safely by:
 * 1. Creating a .env.local file from .env.example if it doesn't exist
 * 2. Prompting for missing values
 * 3. Never overwriting existing values unless explicitly requested
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Paths
const rootDir = path.resolve(__dirname, '..');
const exampleEnvPath = path.join(rootDir, '.env.example');
const localEnvPath = path.join(rootDir, '.env.local');

// Check if .env.example exists
if (!fs.existsSync(exampleEnvPath)) {
  console.error('Error: .env.example file not found!');
  process.exit(1);
}

// Read .env.example
const exampleEnvContent = fs.readFileSync(exampleEnvPath, 'utf8');
const exampleEnvLines = exampleEnvContent.split('\n');

// Parse example env variables
const exampleEnvVars = {};
exampleEnvLines.forEach(line => {
  if (line.trim() && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    if (key) {
      exampleEnvVars[key.trim()] = value.trim();
    }
  }
});

// Read existing .env.local if it exists
let existingEnvVars = {};
if (fs.existsSync(localEnvPath)) {
  console.log('Found existing .env.local file.');
  const existingEnvContent = fs.readFileSync(localEnvPath, 'utf8');
  existingEnvContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      if (key) {
        existingEnvVars[key.trim()] = value.trim();
      }
    }
  });
}

// Function to prompt for variable values
async function promptForValues() {
  const updatedEnvVars = { ...existingEnvVars };
  const missingVars = [];
  
  // Identify missing variables
  for (const key in exampleEnvVars) {
    if (!updatedEnvVars[key] || updatedEnvVars[key] === exampleEnvVars[key]) {
      missingVars.push(key);
    }
  }
  
  if (missingVars.length === 0) {
    console.log('All environment variables are already set!');
    return updatedEnvVars;
  }
  
  console.log(`\nYou need to set ${missingVars.length} environment variables:`);
  
  // Prompt for each missing variable
  for (const key of missingVars) {
    await new Promise(resolve => {
      rl.question(`${key} [${exampleEnvVars[key]}]: `, (answer) => {
        if (answer.trim()) {
          updatedEnvVars[key] = answer.trim();
        } else {
          updatedEnvVars[key] = exampleEnvVars[key];
          console.log(`Using example value for ${key}`);
        }
        resolve();
      });
    });
  }
  
  return updatedEnvVars;
}

// Main function
async function main() {
  console.log('Setting up environment variables...');
  
  const updatedEnvVars = await promptForValues();
  
  // Write to .env.local
  const envContent = Object.entries(updatedEnvVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(localEnvPath, envContent);
  console.log(`\nEnvironment variables saved to ${localEnvPath}`);
  console.log('IMPORTANT: Never commit this file to version control!');
  
  rl.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
