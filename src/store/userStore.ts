import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  email: string;
  phone: string;
  country_code: string | null;
  country: string | null;
  username: string | null;
  avatar: string;
  balance: number;
  copy_trader: number;
  currency_code: string;
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
          }
      }
  )
);

export default useUserStore;
