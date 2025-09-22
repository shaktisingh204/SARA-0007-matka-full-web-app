
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { StateStorage } from 'zustand/middleware';

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

// --- API Logger Store ---
type LogEntry = {
  title: string;
  data: any;
};

type LogState = {
  logs: LogEntry[];
  isOpen: boolean;
};

type LogActions = {
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;
  toggle: () => void;
};

export const useLogStore = create<LogState & LogActions>((set) => ({
  logs: [],
  isOpen: false,
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
  clearLogs: () => set({ logs: [] }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
// -----------------------


export const useAppStore = create<AppState & AppActions>((set) => ({
  isSheetOpen: false,
  toggleSheet: () => set((state) => ({ isSheetOpen: !state.isSheetOpen })),
  setSheetOpen: (isOpen) => set({ isSheetOpen: isOpen }),
}));

const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return Cookies.get(name) || null;
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, { expires: 7, path: '/' });
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
}

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
      storage: createJSONStorage(() => cookieStorage), 
    }
  )
);
