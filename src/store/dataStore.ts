import { create } from "zustand";
import axiosInstance from "@/lib/axios";

export interface Currency {
  id: number;
  name: string;
  symbol: string;
  icon: string;
  code: string;
  rate: string;
}

export interface Wallet {
  id: string;
  user_id: string | null;
  crypto: string;
  crypto_network: string;
  address: string;
  balance: string;
  barcode: string;
  is_active: number;
  is_general: number;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface WithdrawalMethod {
  id: string;
  title: string;
  min_amount: number;
  max_amount: number;
}

export interface Plan {
  id: string;
  title: string;
  color: string;
  icon: string;
  leverage: number;
  features: string[];
}

export interface SiteData {
  currencies: Currency[];
  wallets: Wallet[];
  withdrawal_methods: WithdrawalMethod[];
  crypto_networks: string[];
  plan_features: string[];
  plans: Plan[];
}

interface DataStore {
  data: SiteData | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

// const initialSiteData: SiteData = {
//     currencies: [],
//     wallets: [],
//     withdrawal_methods: [],
// };

const useDataStore = create<DataStore>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/data");
      set({ data: response.data.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch site data:", error);
      set({
        error: "Failed to fetch site data. Please try again later.",
        isLoading: false,
      });
    }
  },
}));

export default useDataStore;
