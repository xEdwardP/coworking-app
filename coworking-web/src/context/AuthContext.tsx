import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types';
import * as authApi from '../api/auth';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('nido_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nido_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .catch(() => {
        localStorage.removeItem('nido_token');
        localStorage.removeItem('nido_user');
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function signIn(email: string, password: string) {
    const { accessToken, user } = await authApi.login(email, password);
    localStorage.setItem('nido_token', accessToken);
    localStorage.setItem('nido_user', JSON.stringify(user));
    setUser(user);
  }

  async function signUp(name: string, email: string, password: string) {
    await authApi.register(name, email, password);
    await signIn(email, password);
  }

  function signOut() {
    localStorage.removeItem('nido_token');
    localStorage.removeItem('nido_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}