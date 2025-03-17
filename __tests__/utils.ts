import axios, { AxiosResponse } from 'axios';

// Configure axios to not throw on non-2xx status codes
axios.defaults.validateStatus = () => true;
axios.defaults.maxRedirects = 0;

// Helper function to extract only the necessary data from the response
export const serializeResponse = (response: AxiosResponse) => {
  const { data, status, statusText, headers } = response;
  return {
    data: typeof data === 'object' ? JSON.parse(JSON.stringify(data)) : data,
    status,
    statusText,
    headers: JSON.parse(JSON.stringify(headers))
  };
};

// Helper function to get response data
export const getResponseData = (response: AxiosResponse | null): any => {
  if (!response) return null;
  return response.data;
};

// Helper function to create a clean response object
export const createCleanResponse = (data: any, status = 200): AxiosResponse => {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {},
    config: {} as any,
  } as AxiosResponse;
};

// Create test teams
export const createTestTeams = () => {
  return [
    { id: 1, name: 'Team A' },
    { id: 2, name: 'Team B' },
  ];
};

// Add Axios interceptor to clean up response data
axios.interceptors.response.use(
  response => createCleanResponse(response),
  error => {
    if (error.response) {
      return Promise.reject(createCleanResponse(error.response));
    }
    return Promise.reject(error);
  }
);

/**
 * Helper function to create a test team
 */
export async function createTestTeam(prisma: any, name: string = 'Test Team') {
  return await prisma.team.create({
    data: {
      name,
      players: []
    }
  });
} 