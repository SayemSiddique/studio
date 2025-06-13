"use client";

import type { User } from 'firebase/auth';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
// Mock user type, replace with actual Firebase User if using Firebase Auth
type MockUser = { uid: string; email: string | null; displayName?: string | null };

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  login: (email?: string, password?: string) => Promise<void>; // Parameters for mock login
  signup: (email?: string, password?: string) => Promise<void>; // Parameters for mock signup
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for persisted user (e.g., in localStorage)
    const storedUser = localStorage.getItem('saforaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email = "test@example.com", password = "password") => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser: MockUser = { uid: '123', email: email, displayName: email.split('@')[0] };
    setUser(mockUser);
    localStorage.setItem('saforaUser', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signup = async (email = "test@example.com", password = "password") => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser: MockUser = { uid: '456', email: email, displayName: email.split('@')[0] };
    setUser(mockUser);
    localStorage.setItem('saforaUser', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem('saforaUser');
    localStorage.removeItem('saforaUserProfile'); // Also clear profile on logout
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
