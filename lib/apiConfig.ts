// API configuration to handle environment-specific URLs
const getApiBaseUrl = () => {
  // In development, use the local server
  if (process.env.NODE_ENV === 'development') {
    return '';  // Empty string means use relative URLs which will go to the local server
  }
  
  // In production, use the deployed URL
  return process.env.NEXT_PUBLIC_API_URL || '';
};

export const apiConfig = {
  baseUrl: getApiBaseUrl(),
  
  // Helper method to get the full API URL
  getUrl: (path: string) => {
    const baseUrl = getApiBaseUrl();
    // If baseUrl is empty, just return the path (for relative URLs)
    return baseUrl ? `${baseUrl}${path}` : path;
  }
};
