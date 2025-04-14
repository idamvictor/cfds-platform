import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import axiosInstance from "@/lib/axios";
import QRCodeDeposit from "./qr-code-deposit";
import { Wallet } from "@/store/dataStore";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";

export default function CryptoWalletDeposit() {
  const { crypto } = useParams<{ crypto: string }>();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await axiosInstance.get("/data");
        const wallets = response.data.data.wallets;
        const foundWallet = wallets.find(
          (w: Wallet) =>
            w.crypto.toLowerCase() === crypto?.toLowerCase() &&
            w.is_general === 1
        );

        if (!foundWallet) {
          toast.error("Wallet not found");
          return;
        }

        setWallet(foundWallet);
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(
          axiosError.response?.data?.message ||
            "Failed to load wallet information"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchWallet();
  }, [crypto]);

  const handleSubmit = async (amount: string) => {
    try {
      await axiosInstance.post(
        "/user/deposit/store",
        {
          amount,
          wallet_id: wallet?.id,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      toast.success("Deposit request submitted successfully");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to submit deposit request"
      );
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!wallet) {
    return <div className="text-center p-4">No wallet found for {crypto}</div>;
  }

  return (
    <QRCodeDeposit
      address={wallet.address}
      title={`${wallet.crypto} Deposit`}
      qrTitle={`${wallet.crypto} QR CODE`}
      addressTitle={`${wallet.crypto} ADDRESS`}
      onSubmit={handleSubmit}
    />
  );
}
