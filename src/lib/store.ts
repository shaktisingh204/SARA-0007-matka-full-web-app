
import { create } from 'zustand';

type State = {
  isSheetOpen: boolean;
};

type Actions = {
  toggleSheet: () => void;
  setSheetOpen: (isOpen: boolean) => void;
};

export const useStore = create<State & Actions>((set) => ({
  isSheetOpen: false,
  toggleSheet: () => set((state) => ({ isSheetOpen: !state.isSheetOpen })),
  setSheetOpen: (isOpen) => set({ isSheetOpen: isOpen }),
}));
