import { create } from "zustand";
import axiosInstance from "@/lib/axios";

export interface SavingsPeriod {
  roi: number;
  title: string;
  period: string;
}

export interface SavingsPlan {
  id: string;
  title: string;
  period: string;
  currency: string;
  status: boolean;
  periods: SavingsPeriod[];
}

export interface UserSaving {
  id: string;
  currency: string;
  roi: string;
  days: number;
  is_flexible: number;
  amount: string;
  earned: string;
  start_date: string;
  end_date: string | null;
  usd_amount: string;
  days_elapsed: number;
  created_at: string;
}

interface SavingsStore {
  plans: SavingsPlan[];
  userSavings: UserSaving[];
  isLoading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  fetchUserSavings: () => Promise<void>;
  createSaving: (data: {
    amount: number;
    period: string;
    roi: number;
    plan_id: string;
  }) => Promise<void>;
}

const useSavingsStore = create<SavingsStore>((set) => ({
  plans: [],
  userSavings: [],
  isLoading: false,
  error: null,

  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/savings/plans");
      set({ plans: response.data.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch savings plans:", error);
      set({
        error: "Failed to fetch savings plans. Please try again later.",
        isLoading: false,
      });
    }
  },

  fetchUserSavings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/savings");
      set({ userSavings: response.data.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch user savings:", error);
      set({
        error: "Failed to fetch your savings. Please try again later.",
        isLoading: false,
      });
    }
  },

  createSaving: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/savings/store", data);
      // After creating a new saving, fetch the updated list
      const response = await axiosInstance.get("/savings");
      set({ userSavings: response.data.data, isLoading: false });
    } catch (error) {
      console.error("Failed to create savings plan:", error);
      set({
        error: "Failed to create savings plan. Please try again later.",
        isLoading: false,
      });
      throw error;
    }
  },
}));

export default useSavingsStore;
