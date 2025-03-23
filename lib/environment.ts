/**
 * Environment configuration
 * 
 * This file provides environment detection and configuration for the application.
 * It ensures proper separation between local development, preview/development, and production environments.
 */

// Environment detection
export const isServer = typeof window === 'undefined';
export const isBrowser = !isServer;

// Determine if running on localhost
export const isLocalDevelopment = isBrowser && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Determine if running in production
export const isProduction = 
  process.env.NODE_ENV === 'production' && 
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

// Determine if running in preview/development
export const isPreviewOrDevelopment = 
  process.env.NODE_ENV === 'production' && 
  (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'development');

// Environment names
export const environmentName = isProduction 
  ? 'production' 
  : isPreviewOrDevelopment 
    ? 'preview/development' 
    : 'local development';

// Supabase configuration
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  // Development database: gyvaalhcjrwozinpilsw
  // Production database: ylhwysupdkmbunaascky
  isDevelopmentDatabase: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('gyvaalhcjrwozinpilsw') || false,
  isProductionDatabase: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('ylhwysupdkmbunaascky') || false,
};

// Vercel configuration
export const vercelConfig = {
  // Development URL: cd-golf-league-2025.vercel.app
  // Production URL: cd-golf-league.vercel.app
  url: process.env.NEXT_PUBLIC_VERCEL_URL || '',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
  env: process.env.NEXT_PUBLIC_VERCEL_ENV || '',
};

// WebSocket configuration
export const websocketConfig = {
  // Local development: ws://localhost:3007
  // Preview/Development: wss://cd-golf-league-2025.vercel.app
  // Production: wss://cd-golf-league.vercel.app
  protocol: isLocalDevelopment ? 'ws' : 'wss',
  host: isLocalDevelopment 
    ? 'localhost:3007' 
    : isProduction 
      ? 'cd-golf-league.vercel.app' 
      : process.env.NEXT_PUBLIC_BASE_URL || 'cd-golf-league-2025.vercel.app',
  path: '/api/scores/ws',
};

// Log environment information
export function logEnvironmentInfo() {
  console.log('Environment Information:');
  console.log(`- Environment: ${environmentName}`);
  console.log(`- Node Environment: ${process.env.NODE_ENV}`);
  console.log(`- Vercel Environment: ${vercelConfig.env}`);
  console.log(`- Supabase URL: ${supabaseConfig.url}`);
  console.log(`- Using ${supabaseConfig.isDevelopmentDatabase ? 'DEVELOPMENT' : supabaseConfig.isProductionDatabase ? 'PRODUCTION' : 'UNKNOWN'} database`);
  console.log(`- WebSocket: ${websocketConfig.protocol}://${websocketConfig.host}${websocketConfig.path}`);
}

// Validate environment configuration
export function validateEnvironment() {
  // Check for required environment variables
  if (!supabaseConfig.url) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  
  if (!supabaseConfig.anonKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }
  
  // Ensure we're not using production database in development
  if (!isProduction && supabaseConfig.isProductionDatabase) {
    console.error('WARNING: Using PRODUCTION database in a non-production environment!');
  }
  
  // Ensure we're not using development database in production
  if (isProduction && supabaseConfig.isDevelopmentDatabase) {
    console.error('WARNING: Using DEVELOPMENT database in production environment!');
  }
  
  return {
    isValid: !!supabaseConfig.url && !!supabaseConfig.anonKey,
    isProperlyConfigured: 
      (isProduction && supabaseConfig.isProductionDatabase) || 
      (!isProduction && supabaseConfig.isDevelopmentDatabase)
  };
}

// Get WebSocket URL
export function getWebSocketUrl(matchId?: string): string {
  const { protocol, host, path } = websocketConfig;
  const matchParam = matchId ? `?matchId=${matchId}` : '';
  return `${protocol}://${host}${path}${matchParam}`;
}

// Export default environment configuration
export default {
  isServer,
  isBrowser,
  isLocalDevelopment,
  isProduction,
  isPreviewOrDevelopment,
  environmentName,
  supabaseConfig,
  vercelConfig,
  websocketConfig,
  logEnvironmentInfo,
  validateEnvironment,
  getWebSocketUrl
};
