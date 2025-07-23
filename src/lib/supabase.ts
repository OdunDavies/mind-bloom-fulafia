import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  email: string;
  name: string;
  user_type: 'student' | 'counselor';
  age?: number;
  gender?: string;
  department?: string;
  specialty?: string;
  bio?: string;
  availability?: string;
  created_at: string;
  updated_at: string;
  quiz_score?: number;
  quiz_result?: 'Mild' | 'Moderate' | 'Critical';
  quiz_timestamp?: string;
  is_online: boolean;
  last_seen: string;
}

export interface QuizResult {
  score: number;
  result: 'Mild' | 'Moderate' | 'Critical';
  timestamp: string;
}