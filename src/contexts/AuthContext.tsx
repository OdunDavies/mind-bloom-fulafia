import React, { createContext, useContext, useState, useEffect } from 'react';

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
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
  quizResult: QuizResult | null;
  updateQuizResult: (result: QuizResult) => void;
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
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('fulafia_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Load quiz result for this user
      const savedQuizResult = localStorage.getItem(`fulafia_quiz_${userData.id}`);
      if (savedQuizResult) {
        setQuizResult(JSON.parse(savedQuizResult));
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('fulafia_users') || '[]');
      const foundUser = users.find((u: User) => u.email === email);
      
      if (foundUser) {
        // In a real app, you'd verify the password hash
        const savedPassword = localStorage.getItem(`fulafia_password_${foundUser.id}`);
        if (savedPassword === password) {
          setUser(foundUser);
          localStorage.setItem('fulafia_user', JSON.stringify(foundUser));
          
          // Load quiz result for this user
          const savedQuizResult = localStorage.getItem(`fulafia_quiz_${foundUser.id}`);
          if (savedQuizResult) {
            setQuizResult(JSON.parse(savedQuizResult));
          }
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData: any): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('fulafia_users') || '[]');
      
      // Check if user already exists
      const existingUser = users.find((u: User) => u.email === userData.email);
      if (existingUser) {
        return false;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('fulafia_users', JSON.stringify(users));
      localStorage.setItem(`fulafia_password_${newUser.id}`, userData.password);
      
      setUser(newUser);
      localStorage.setItem('fulafia_user', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
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
      localStorage.setItem(`fulafia_quiz_${user.id}`, JSON.stringify(result));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      quizResult,
      updateQuizResult
    }}>
      {children}
    </AuthContext.Provider>
  );
};