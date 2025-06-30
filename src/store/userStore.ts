import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";

export interface UserAccount {
  type: "balance" | "credit";
  transfer_type: "to" | "from";
  title: string;
  balance: number;
  balance_value: string;
  status: "active" | "inactive" | "suspended";
  currency: string;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  image: string | null;
  color: "danger" | "success" | "warning" | null;
  type: string;
  time: string;
  read_at: string | null;
  created_at: string | null;
  read: boolean;
}

export interface User {
  id: string;
  account_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_code: string | null;
  country: string | null;
  address: string | null;
  username: string | null;
  avatar: string;
  balance: number;
  savings_balance: number;
  credit_balance: number;
  birth_date?: string;
  custom_wallet?: string;
  copy_trader: number;
  autotrader: boolean;
  autotrader_status: string;
  verification_status: string;
  notification_msg: string | null;
  status: string;
  can_open_trade: boolean;
  can_close_trade: boolean;
  trades_summary: {
    total_pnl: number;
    total_wins: number;
    total_losses: number;
    total_deposit: number;
    trades_count: number;
    win_rate: number;
  };
  account_type: {
    id: string;
    title: string;
    leverage: number;
    icon: string;
    color: string;
    image: string;
    expert_advisors: string[]; // Array of expert advisor IDs available for this plan
  };
  eas? : string[];
  accounts: UserAccount[];
  notifications: UserNotification[];
}

interface UserStore {
  user: User | null;
  token: string | null;
  selectedAccountIndex: number;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
  isLoading: boolean;
  setSelectedAccountIndex: (index: number) => void;
  getCurrentUser: () => Promise<void>;
}

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      selectedAccountIndex: 0,
      setUser: (user, token) => set({ user, token }),
      clearUser: () =>
        set({ user: null, token: null, selectedAccountIndex: 0 }),
      isLoading: true,
      setSelectedAccountIndex: (index) => set({ selectedAccountIndex: index }),
      getCurrentUser: async () => {
        // Don't attempt to fetch if no token is available
        const token = get().token;
        if (!token) {
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await axiosInstance.get("/user");

          if (response.data && response.data.data) {
            // Update the user while keeping the current token
            set({
              user: response.data.data,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // Don't clear user on error, just set loading to false
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoading = false;
      },
    }
  )
);

export default useUserStore;
