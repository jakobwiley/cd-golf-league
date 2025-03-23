// Mock Supabase client for testing
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  match: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  data: [],
  error: null,
  then: jest.fn((callback) => Promise.resolve(callback({ data: [], error: null }))),
  catch: jest.fn(),
  subscribe: jest.fn().mockReturnValue({
    on: jest.fn().mockReturnValue({
      subscribe: jest.fn().mockReturnValue({
        unsubscribe: jest.fn()
      })
    })
  }),
  auth: {
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
    getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
    getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null })
  },
  storage: {
    from: jest.fn().mockReturnValue({
      upload: jest.fn(),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/image.jpg' } })
    })
  },
  realtime: {
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockImplementation((callback) => {
        callback();
        return {
          unsubscribe: jest.fn()
        };
      })
    })
  }
};

export const createClient = jest.fn().mockReturnValue(mockSupabase);

// Export the mock client for tests to use
export default mockSupabase;
