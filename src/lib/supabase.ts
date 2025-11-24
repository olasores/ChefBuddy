import { createClient } from '@supabase/supabase-js';

// IMPORTANT: SUPABASE CONFIGURATION
// You MUST replace the placeholder strings below with your actual Supabase project URL
// and public Anon Key, which you can find in your Supabase project settings -> API.
// If you are loading these securely from a .env file, the structure should look
// something like: const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const supabaseUrl = 'https://utfpxeacqnyewfvrjykj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZnB4ZWFjcW55ZXdmdnJqeWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NTY3NTEsImV4cCI6MjA3ODEzMjc1MX0.AEOv_TwnGD3dDvfORRp-vZLi1xHfFDSYyal7sGRtzjg';

// --- Initialization Logic ---
if (supabaseUrl === 'https://utfpxeacqnyewfvrjykj.supabase.co' || supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZnB4ZWFjcW55ZXdmdnJqeWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NTY3NTEsImV4cCI6MjA3ODEzMjc1MX0.AEOv_TwnGD3dDvfORRp-vZLi1xHfFDSYyal7sGRtzjg') {
  console.error(
    "CONFIGURATION ERROR: Supabase client is initialized with placeholder values. " +
    "The app will not function until you replace the placeholder strings " +
    "in this file (src/lib/supabase.js) with your real Supabase credentials."
  );
}

// Create the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Log status for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase Auth Event:', event);
  // This hook is great for handling global navigation based on login/logout events.
});