import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: (login: string, password: string) => boolean;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('auth_token'),

  login: (login: string, password: string) => {
    if (login === 'test' && password === 'test') {
      localStorage.setItem('auth_token', 'valid-token');
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({ isAuthenticated: false });
  },
}));