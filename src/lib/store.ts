
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { StateStorage } from 'zustand/middleware';

type AuthState = {
  token: string | null;
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

// --- User Profile Store ---
export type UserProfile = {
  id: string;
  name: string;
  mobile: string;
  wallet_balance: string;
  bank_details_status: string;
  gpay_status: string;
  phonepe_status: string;
  paytm_status: string;
};

type UserProfileState = {
  userProfile: UserProfile | null;
};

type UserProfileActions = {
  setUserProfile: (profile: UserProfile) => void;
  clearUserProfile: () => void;
};

export const useUserProfileStore = create(
  persist<UserProfileState & UserProfileActions>(
    (set) => ({
      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),
      clearUserProfile: () => set({ userProfile: null }),
    }),
    {
      name: 'user-profile-storage', 
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
);
// --------------------------


export const useAppStore = create<AppState & AppActions>((set) => ({
  isSheetOpen: false,
  toggleSheet: () => set((state) => ({ isSheetOpen: !state.isSheetOpen })),
  setSheetOpen: (isOpen) => set({ isSheetOpen: isOpen }),
}));


export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    token: null,
    setToken: (token) => set({ token }),
    logout: () => {
      Cookies.remove('auth_token');
      set({ token: null })
    },
}));
