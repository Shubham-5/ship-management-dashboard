import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LOCAL_STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/localStorage';

export interface User {
  id: string;
  role: 'Admin' | 'Inspector' | 'Engineer';
  email: string;
  password: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initializeAuth: () => void;
}

const initializeUsers = () => {
  const existingUsers = getFromStorage(LOCAL_STORAGE_KEYS.USERS);
  if (!existingUsers) {
    const defaultUsers: User[] = [
      { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123", name: "Admin User" },
      { id: "2", role: "Inspector", email: "inspector@entnt.in", password: "inspect123", name: "Inspector User" },
      { id: "3", role: "Engineer", email: "engineer@entnt.in", password: "engine123", name: "Engineer User" }
    ];
    saveToStorage(LOCAL_STORAGE_KEYS.USERS, defaultUsers);
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const users: User[] = getFromStorage(LOCAL_STORAGE_KEYS.USERS) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          set({ user, isAuthenticated: true });
          saveToStorage(LOCAL_STORAGE_KEYS.CURRENT_USER, user);
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
      },

      initializeAuth: () => {
        initializeUsers();
        const currentUser = getFromStorage(LOCAL_STORAGE_KEYS.CURRENT_USER);
        if (currentUser) {
          set({ user: currentUser, isAuthenticated: true });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
