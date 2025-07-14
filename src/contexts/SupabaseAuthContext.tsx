import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'>;

export interface QuizResult {
  score: number;
  result: 'Mild' | 'Moderate' | 'Critical';
  timestamp: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, userData: Partial<Profile>) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateQuizResult: (result: QuizResult) => Promise<void>;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile data when authenticated
          setTimeout(async () => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileData) {
              setProfile(profileData);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signup = async (email: string, password: string, userData: Partial<Profile>) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: userData.name,
            user_type: userData.user_type,
            age: userData.age,
            gender: userData.gender,
            department: userData.department,
            specialty: userData.specialty,
            bio: userData.bio,
            availability: userData.availability,
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred during signup' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateQuizResult = async (result: QuizResult) => {
    if (!user) return;

    await supabase
      .from('profiles')
      .update({
        quiz_score: result.score,
        quiz_result: result.result,
        quiz_timestamp: result.timestamp,
      })
      .eq('id', user.id);

    // Update local profile state
    if (profile) {
      setProfile({
        ...profile,
        quiz_score: result.score,
        quiz_result: result.result,
        quiz_timestamp: result.timestamp,
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      login,
      signup,
      logout,
      updateQuizResult
    }}>
      {children}
    </AuthContext.Provider>
  );
};