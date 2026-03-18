export interface DepositRequest {
  amount: number;
  method: "card" | "crypto";
  card_holder_name: string;
  card_number: string;
  exp_date: string;
  csv: string;
  wallet_id?: string | null;
  crypto?: string;
  crypto_network?: string;
}

export interface DepositResponse {
  status: "success" | "error";
  message: string;
  data: unknown[];
}
