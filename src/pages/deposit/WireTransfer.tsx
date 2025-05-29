import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

interface WireTransferProps {
    wireTransferInfo: string;
    onDepositSuccess?: () => void;
}

export default function WireTransfer({ wireTransferInfo, onDepositSuccess }: WireTransferProps) {
    const [transferDetails, setTransferDetails] = useState({
        amount: "",
        transaction_id: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setTransferDetails({
            ...transferDetails,
            [field]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Form validation
        if (!transferDetails.amount || parseFloat(transferDetails.amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        if (!transferDetails.transaction_id.trim()) {
            toast.error("Please enter the transaction ID");
            return;
        }

        setIsSubmitting(true);
        try {
            await axiosInstance.post("/user/deposit/store", {
                amount: transferDetails.amount,
                method: "wire_transfer",
                info: wireTransferInfo,
                transaction_id: transferDetails.transaction_id,
            });

            toast.success("Wire transfer deposit submitted successfully");
            onDepositSuccess?.();

            // Reset form
            setTransferDetails({
                amount: "",
                transaction_id: "",
            });
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(
                axiosError.response?.data?.message || "Failed to submit wire transfer deposit"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Wire Transfer Details</h3>
                <p className="text-muted-foreground text-sm">
                    Please use the following information to complete your wire transfer
                </p>
            </div>

            <Card className="bg-muted/30 border-primary/20">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <h4 className="font-medium">Banking Information</h4>
                        </div>

                        <div className="bg-background/50 rounded-lg p-4 border">
              <pre className="text-sm font-mono whitespace-pre-wrap break-words text-foreground">
                {wireTransferInfo.replace(/\r\n/g, '\n')}
              </pre>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4">
                            <div className="flex gap-2">
                                <div className="w-4 h-4 bg-amber-500 rounded-full flex-shrink-0 mt-0.5"></div>
                                <div>
                                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                        Important Notice
                                    </p>
                                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                        Please include your account ID as the reference when making the transfer.
                                        Processing may take 1-3 business days.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Transfer Form */}
            <Card className="bg-muted/30 border-primary/20">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <h4 className="font-medium">Transfer Details</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Transfer Amount</Label>
                                <div className="relative">
                                     <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="bg-background/10 border-primary/20 text-muted-foreground focus:border-primary/50 transition-all"
                                        placeholder="0.00"
                                        value={transferDetails.amount}
                                        onChange={(e) => handleInputChange("amount", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="transaction_id">Transaction ID / Reference</Label>
                                <Input
                                    id="transaction_id"
                                    placeholder="Enter bank reference number"
                                    className="bg-background/10 border-primary/20 text-muted-foreground focus:border-primary/50 transition-all"
                                    value={transferDetails.transaction_id}
                                    onChange={(e) => handleInputChange("transaction_id", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Submitting Transfer...
                                </>
                            ) : (
                                "Submit Wire Transfer"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
