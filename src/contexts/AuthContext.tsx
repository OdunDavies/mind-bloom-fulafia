import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Profile, QuizResult } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends Profile {
  userType: 'student' | 'counselor'; // Alias for user_type for backward compatibility
  createdAt: string; // Alias for created_at for backward compatibility
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
  quizResult: QuizResult | null;
  updateQuizResult: (result: QuizResult) => void;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
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
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setQuizResult(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        setLoading(false);
        return;
      }

      if (profile) {
        const userData: User = {
          ...profile,
          userType: profile.user_type,
          createdAt: profile.created_at
        };
        setUser(userData);

        // Load quiz result if exists
        if (profile.quiz_score !== null && profile.quiz_result && profile.quiz_timestamp) {
          setQuizResult({
            score: profile.quiz_score,
            result: profile.quiz_result,
            timestamp: profile.quiz_timestamp
          });
        }
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData: any): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
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
        console.error('Signup error:', error);
        return false;
      }

      // If user is created but not confirmed, we still consider it successful
      return !!data.user;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setQuizResult(null);
    localStorage.removeItem('fulafia_user');
  };

  const updateQuizResult = (result: QuizResult) => {
    setQuizResult(result);
    if (user) {
      // Update the profile in Supabase
      supabase
        .from('profiles')
        .update({
          quiz_score: result.score,
          quiz_result: result.result,
          quiz_timestamp: result.timestamp
        })
        .eq('id', user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error updating quiz result:', error);
          }
        });
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      // Reload user profile
      const authUser = await supabase.auth.getUser();
      if (authUser.data.user) {
        await loadUserProfile(authUser.data.user);
      }

      return true;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return false;
    }
  };
    setQuizResult(result);
    if (user) {
      localStorage.setItem(`fulafia_quiz_${user.id}`, JSON.stringify(result));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      quizResult,
      updateQuizResult,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};