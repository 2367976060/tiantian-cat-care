import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

export const createClient = () => {
  return createClientComponentClient<Database>();
};

// Client-side supabase instance for browser use
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
  if (typeof window === 'undefined') {
    return createClient();
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
};

// Simple client for static export (falls back to localStorage if no Supabase)
export const hasSupabaseConfig = () => {
  if (typeof window === 'undefined') return false;
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url'
  );
};
