import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { DepositRequest, DepositResponse } from "./deposit-types";

// Fetch logic
const submitDeposit = async (
  data: DepositRequest,
): Promise<DepositResponse> => {
  const response = await axiosInstance.post<DepositResponse>(
    "/user/deposit/store",
    data,
  );
  return response.data;
};

// Query hook
export const useDepositMutation = () => {
  return useMutation({
    mutationFn: submitDeposit,
  });
};
