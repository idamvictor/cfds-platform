import { create } from "zustand";

export type PanelType =
  | "market-watch"
  | "active-orders"
  | "trading-history"
  | "calendar"
  | "market-news"
  | "trade-room"
  | "watch-list"
  | "financial-history"
  | "video-guides"
  | "technical-analysis"
  | null;

interface OverlayState {
  automatedTrading: boolean;
  setAutomatedTrading: (open: boolean) => void;
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  resetAll: () => void;
}

const useOverlayStore = create<OverlayState>((set) => ({
  automatedTrading: false,
  setAutomatedTrading: (open) => set({ automatedTrading: open }),
  activePanel: null,
  setActivePanel: (panel) => set({ activePanel: panel }),
  resetAll: () =>
    set({
      automatedTrading: false,
      activePanel: null,
    }),
}));

export default useOverlayStore;
