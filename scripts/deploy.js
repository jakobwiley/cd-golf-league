// deploy.js
console.log('Starting deployment process...');
console.log('Environment variables:');
console.log('CI:', process.env.CI);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Force CI to be false
process.env.CI = 'false';
console.log('Set CI to false');

// This script doesn't actually do anything, it's just to help debug the deployment process
console.log('Deployment script completed successfully'); 