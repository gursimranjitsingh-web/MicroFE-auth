/**
 * DEPRECATED - This file is no longer used
 * 
 * The application now uses event-driven communication via EventBus (RxJS)
 * instead of Context API for sharing state between micro-frontends.
 * 
 * See:
 * - src/eventBus/index.ts - Event bus implementation
 * - src/services/authService.ts - Auth state management with events
 * 
 * This file is kept for reference only.
 */

import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { login, logout, updateUserData } from '../store/authSlice';
import type { ReactNode } from 'react';

interface UserData {
  name: string;
  role: string;
  permissions: string[];
  theme: string;
}

interface AuthContextType {
  token: string | null;
  userData: UserData | null;
  login: () => void;
  logout: () => void;
  updateUserData: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { token, userData } = useSelector((state: RootState) => state.auth);

  const value = {
    token,
    userData,
    login: () => dispatch(login()),
    logout: () => dispatch(logout()),
    updateUserData: (name: string) => dispatch(updateUserData(name)),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};