import { create } from "zustand";

interface OverlayState {
  automatedTrading: boolean;
  selectedAdvisorId: string | undefined;
  activePanel: string | null;
  showDepositModal: boolean;
  setAutomatedTrading: (trading: boolean, advisorId?: string) => void;
  setActivePanel: (panel: string | null) => void;
  setShowDepositModal: (show: boolean) => void;
}

const useOverlayStore = create<OverlayState>((set) => ({
  automatedTrading: false,
  selectedAdvisorId: undefined,
  activePanel: null,
  showDepositModal: false,
  setAutomatedTrading: (trading, advisorId) =>
    set({ automatedTrading: trading, selectedAdvisorId: advisorId }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setShowDepositModal: (show) => set({ showDepositModal: show }),
}));

export default useOverlayStore;
