import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'student' | 'counselor';
  age?: number;
  gender?: string;
  department?: string;
  specialty?: string;
  bio?: string;
  availability?: string;
  createdAt: string;
}

export interface QuizResult {
  score: number;
  result: 'Mild' | 'Moderate' | 'Critical';
  timestamp: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  quizResult: QuizResult | null;
  updateQuizResult: (result: QuizResult) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              userType: profile.user_type as 'student' | 'counselor',
              age: profile.age,
              gender: profile.gender,
              department: profile.department,
              specialty: profile.specialty,
              bio: profile.bio,
              availability: profile.availability,
              createdAt: profile.created_at
            });
            
            // Load quiz result for this user
            const savedQuizResult = localStorage.getItem(`fulafia_quiz_${profile.id}`);
            if (savedQuizResult) {
              setQuizResult(JSON.parse(savedQuizResult));
            }
          }
        } else {
          setUser(null);
          setQuizResult(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signup = async (userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: userData.name,
            user_type: userData.userType,
            age: userData.age,
            gender: userData.gender,
            department: userData.department,
            specialty: userData.specialty,
            bio: userData.bio,
            availability: userData.availability
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setQuizResult(null);
  };

  const updateQuizResult = (result: QuizResult) => {
    setQuizResult(result);
    if (user) {
      localStorage.setItem(`fulafia_quiz_${user.id}`, JSON.stringify(result));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      login,
      signup,
      logout,
      quizResult,
      updateQuizResult,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};