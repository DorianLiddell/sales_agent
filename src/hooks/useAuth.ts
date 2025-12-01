import { create } from "zustand";

interface AuthState {
    isAutthenticated: boolean;
    login: (login: string, password: string) => boolean;
    logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
    isAutthenticated: !!localStorage.getItem(`auth_token`),

    login: (login: string, password: string) => {
        if (login === 'test' && password === 'test') {
            localStorage.setItem('auth_token', 'valid-token');
            set({ isAutthenticated: true});
            return true;
        }
        return false;
    },

    logout: () => {
        localStorage.removeItem('auth_token');
        set({ isAutthenticated: false});
    },
}));