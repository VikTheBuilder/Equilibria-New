import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const DEMO_USER: User = {
  id: 'demo-user-1',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  phoneNumber: '+1234567890',
  dateOfBirth: '1990-01-01',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const saveUserToStorage = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const removeUserFromStorage = () => {
    localStorage.removeItem('user');
  };

  const signIn = async (email: string, password: string) => {
    // For demo purposes, accept any email/password combination
    // In a real app, you would validate against a backend
    const userData: User = {
      id: `user-${Date.now()}`,
      email,
      firstName: email.split('@')[0],
      lastName: 'User',
    };
    
    setUser(userData);
    saveUserToStorage(userData);
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    // For demo purposes, create a new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      firstName: userData.firstName || email.split('@')[0],
      lastName: userData.lastName || 'User',
      phoneNumber: userData.phoneNumber,
      dateOfBirth: userData.dateOfBirth,
    };
    
    setUser(newUser);
    saveUserToStorage(newUser);
  };

  const signInWithGoogle = async () => {
    // For demo purposes, use the demo user
    setUser(DEMO_USER);
    saveUserToStorage(DEMO_USER);
  };

  const logout = async () => {
    setUser(null);
    removeUserFromStorage();
  };

  const refreshUser = async () => {
    // Refresh user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        setUser(null);
      }
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};