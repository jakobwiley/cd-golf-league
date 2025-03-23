// Test file to verify Supabase connection
import { supabase } from '../../lib/supabase';

describe('Supabase Connection', () => {
  it('should connect to Supabase successfully', async () => {
    // Simple query to test connection
    const { data, error } = await supabase
      .from('Match')
      .select('id')
      .limit(1);
    
    // Log connection details for debugging
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Key available:', !!process.env.SUPABASE_SERVICE_ROLE_KEY || !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    if (error) {
      console.error('Supabase connection error:', error);
    }
    
    // Expect no error
    expect(error).toBeNull();
    // Expect data to be an array (even if empty)
    expect(Array.isArray(data)).toBe(true);
  });
});
