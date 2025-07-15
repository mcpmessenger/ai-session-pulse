import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vjadjavsvjrozlukbfnp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYWRqYXZzdmpyb3psdWtiZm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NDAwNzAsImV4cCI6MjA2ODExNjA3MH0.eXuFP8d4-lkNpYQs5sYAIWmBmohTxcEpYvh78JUQeec';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);