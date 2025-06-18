
"use client";

import type { User } from 'firebase/auth';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
// Mock user type, replace with actual Firebase User if using Firebase Auth
type MockUser = { uid: string; email: string | null; displayName?: string | null, photoURL?: string | null };

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  signup: (email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithPhoneNumber: () => Promise<void>; // Simplified: no OTP
  forgotPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('saforaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const updateUserAndStorage = (mockUser: MockUser | null) => {
    setUser(mockUser);
    if (mockUser) {
      localStorage.setItem('saforaUser', JSON.stringify(mockUser));
    } else {
      localStorage.removeItem('saforaUser');
      localStorage.removeItem('saforaUserProfile'); // Also clear profile on logout
    }
  };

  const login = async (email = "test@example.com", password = "password") => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser: MockUser = { uid: '123', email: email, displayName: email.split('@')[0] };
    updateUserAndStorage(mockUser);
    setLoading(false);
  };

  const signup = async (email = "newuser@example.com", password = "password") => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser: MockUser = { uid: '456', email: email, displayName: email.split('@')[0] };
    updateUserAndStorage(mockUser);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    updateUserAndStorage(null);
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser: MockUser = { uid: 'google-user-123', email: 'user@google.com', displayName: 'Google User', photoURL: 'https://placehold.co/100x100.png?text=G' };
    updateUserAndStorage(mockUser);
    setLoading(false);
  };

  const loginWithFacebook = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser: MockUser = { uid: 'fb-user-456', email: 'user@facebook.com', displayName: 'Facebook User', photoURL: 'https://placehold.co/100x100.png?text=F' };
    updateUserAndStorage(mockUser);
    setLoading(false);
  };

  const loginWithPhoneNumber = async () => {
    setLoading(true);
    // Simulate phone auth flow (e.g. entering OTP)
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    const mockUser: MockUser = { uid: 'phone-user-789', email: null, displayName: 'Phone User (+1...1234)', photoURL: 'https://placehold.co/100x100.png?text=P' };
    updateUserAndStorage(mockUser);
    setLoading(false);
    // In a real app, you'd navigate after OTP verification
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, you'd call Firebase's sendPasswordResetEmail(auth, email)
    console.log(`Password reset email sent to ${email} (mock)`);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout, 
      loginWithGoogle, 
      loginWithFacebook, 
      loginWithPhoneNumber, 
      forgotPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
