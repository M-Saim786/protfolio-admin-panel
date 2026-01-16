import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginRequest } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    loading: true
  });

  useEffect(() => {
    const token = authService.getToken();
    setAuthState({
      isAuthenticated: !!token,
      token,
      loading: false
    });
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      const response = await authService.login(credentials);
      
      if (response.token) {
        setAuthState({
          isAuthenticated: true,
          token: response.token,
          loading: false
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      
      // For demo purposes, allow offline login with demo credentials
      if (credentials.username === 'admin' && credentials.password === 'password123') {
        const mockToken = 'demo-token-' + Date.now();
        authService.setDemoToken(mockToken);
        setAuthState({
          isAuthenticated: true,
          token: mockToken,
          loading: false
        });
        return true;
      }
      
      // Re-throw the error if demo credentials don't match
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setAuthState({
      isAuthenticated: false,
      token: null,
      loading: false
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};