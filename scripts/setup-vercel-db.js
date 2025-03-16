// Script to set up the database in Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up Vercel Postgres database...');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
  console.error('Vercel CLI is not installed. Please install it with: npm i -g vercel');
  process.exit(1);
}

// Check if user is logged in to Vercel
try {
  execSync('vercel whoami', { stdio: 'ignore' });
} catch (error) {
  console.error('You are not logged in to Vercel. Please login with: vercel login');
  process.exit(1);
}

// Create Vercel Postgres database
console.log('Creating Vercel Postgres database...');
try {
  execSync('vercel integration add vercel-postgres', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to create Vercel Postgres database:', error.message);
  console.log('If the database already exists, you can ignore this error.');
}

// Generate Prisma client
console.log('Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to generate Prisma client:', error.message);
  process.exit(1);
}

// Deploy to Vercel
console.log('Deploying to Vercel...');
try {
  execSync('vercel --prod', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to deploy to Vercel:', error.message);
  process.exit(1);
}

console.log('Setup complete!');
console.log('To run database migrations, use: vercel env pull && npx prisma migrate deploy'); 