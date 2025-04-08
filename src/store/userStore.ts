import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
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
}

interface UserStore {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      clearUser: () => set({ user: null, token: null }),
    }),
    {
      name: "user-storage", // Key for localStorage
    }
  )
);

export default useUserStore;
