import { supabase } from '../lib/supabase';

export const testSupabaseConnection = async () => {
  try {
    // Test the connection
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connected successfully!');
    return true;
  } catch (err) {
    console.error('❌ Supabase setup error:', err);
    return false;
  }
};

// Test auth status
export const testAuth = () => {
  const session = supabase.auth.getSession();
  console.log('Auth session:', session);
}; 