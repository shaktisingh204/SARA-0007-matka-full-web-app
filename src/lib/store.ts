
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
};

type AuthActions = {
  setToken: (token: string) => void;
  logout: () => void;
};

type AppState = {
  isSheetOpen: boolean;
};

type AppActions = {
  toggleSheet: () => void;
  setSheetOpen: (isOpen: boolean) => void;
};

export const useAppStore = create<AppState & AppActions>((set) => ({
  isSheetOpen: false,
  toggleSheet: () => set((state) => ({ isSheetOpen: !state.isSheetOpen })),
  setSheetOpen: (isOpen) => set({ isSheetOpen: isOpen }),
}));

export const useAuthStore = create(
  persist<AuthState & AuthActions>(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setToken: (token: string) => set({ token, isAuthenticated: true }),
      logout: () => set({ token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
