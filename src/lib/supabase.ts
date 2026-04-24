import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ttfbtxupkwnxgehxuxgh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZmJ0eHVwa3dueGdlaHh1eGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzc2MjksImV4cCI6MjA5MjYxMzYyOX0.LVkc1iYVVKF-l5TbZNQp-1OIIU0ljUHGHV-QSMF8EZQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Force hash change: 2026-04-24T14:35
