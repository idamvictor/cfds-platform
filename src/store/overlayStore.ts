import { create } from "zustand";

interface OverlayState {
  automatedTrading: boolean;
  setAutomatedTrading: (open: boolean) => void;
  // Add more modal states here as needed
  resetAll: () => void;
}

const useOverlayStore = create<OverlayState>((set) => ({
  automatedTrading: false,
  setAutomatedTrading: (open) => set({ automatedTrading: open }),
  // Reset function to close all overlays/modals
  resetAll: () =>
    set({
      automatedTrading: false,
      // Add new states here when adding new modals
    }),
}));

export default useOverlayStore;
