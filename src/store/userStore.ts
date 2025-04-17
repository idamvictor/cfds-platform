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

export interface User {
  id: string;
  account_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_code: string | null;
  country: string | null;
  username: string | null;
  avatar: string;
  balance: number;
  credit_balance: number;
  birth_date?: string;
  copy_trader: number;
  account_type: {
    id: number;
    name: string;
    price: number;
    leverage: number;
    icon: string;
  };
  accounts: UserAccount[];
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
