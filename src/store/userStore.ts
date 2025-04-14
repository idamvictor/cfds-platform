import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserAccount {
  type: "balance" | "credit";
  transfer_type: "to" | "from";
  title: string;
  balance: string;
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
  copy_trader: number;
  birth_date?: string;
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
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
  isLoading: boolean;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      clearUser: () => set({ user: null, token: null }),
      isLoading: true,
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
