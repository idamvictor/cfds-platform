import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import useDataStore from "@/store/dataStore";
import useUserStore from "@/store/userStore";
import { useCurrency } from "@/hooks/useCurrency";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { toast } from "@/components/ui/sonner";
import { AxiosError } from "axios";

interface AccountPlansModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AccountPlansModal({ open, onOpenChange }: AccountPlansModalProps) {
    const { data, isLoading } = useDataStore();
    const user = useUserStore((state) => state.user);
    const getCurrentUser = useUserStore((state) => state.getCurrentUser);
    const { formatCurrency } = useCurrency();
    const visiblePlans = data?.plans?.slice(0, 4) ?? [];
    const planFeatures = data?.plan_features ?? [];
    const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{
        id: string;
        title: string;
        priceLabel: string | null;
    } | null>(null);

    // Get current user's plan title if available
    const currentPlanTitle = user?.account_type?.title || "Basic";

    const handleSubscribe = async (planId: string) => {
        setSubscribingPlanId(planId);
        try {
            const response = await axiosInstance.post("/plans/subscribe", {
                plan_id: planId,
            });

            const message =
                response?.data?.message || "Plan subscribed successfully";
            toast.success(message);

            await getCurrentUser();
            onOpenChange(false);
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            const message =
                axiosError.response?.data?.message ||
                "Failed to subscribe to plan. Please try again.";
            toast.error(message);
        } finally {
            setSubscribingPlanId(null);
        }
    };

    const formatPlanPrice = (price: unknown): string | null => {
        if (price === null || price === undefined || price === "") {
            return null;
        }

        const numericPrice =
            typeof price === "number"
                ? price
                : Number.parseFloat(String(price).replace(/,/g, "").trim());

        if (!Number.isFinite(numericPrice)) {
            return null;
        }

        return formatCurrency(numericPrice);
    };

    const openSubscribeConfirm = (
        planId: string,
        planTitle: string,
        priceLabel: string | null
    ) => {
        setSelectedPlan({ id: planId, title: planTitle, priceLabel });
        setIsConfirmOpen(true);
    };

    const confirmSubscribe = async () => {
        if (!selectedPlan) return;
        setIsConfirmOpen(false);
        await handleSubscribe(selectedPlan.id);
    };



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-5xl p-0 overflow-hidden bg-background border-border max-h-[90vh] overflow-y-auto">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Account Plans
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <p>Loading plans...</p>
                    </div>
                ) : visiblePlans.length === 0 ? (
                    <div className="text-center p-6">
                        <p>No plans available. Please try again later.</p>
                    </div>
                ) : (
                    <>
                        <div className="p-4 overflow-x-auto">
                            <div className="min-w-[800px]">
                                <div className="grid grid-cols-5 gap-px bg-muted/30 rounded-lg overflow-hidden shadow-sm">
                                    {/* Headers */}
                                    <div className="col-span-1 bg-background p-4 font-medium"></div>
                                    {visiblePlans.map((plan) => {
                                        const isRecommended = plan.title === "Pro";
                                        const priceLabel = formatPlanPrice(plan.price);

                                        // Determine header background style using plan's color
                                        const headerStyle = {
                                            backgroundColor: plan.color || "gray"
                                        };

                                        return (
                                            <div
                                                key={`header-${plan.id}`}
                                                className={cn(
                                                    "col-span-1 text-center p-3 text-white font-semibold relative cursor-pointer",
                                                    user?.account_type?.id === plan.id ? "ring-2 ring-primary" : ""
                                                )}
                                                style={headerStyle}
                                            >
                                                <div className="flex items-center justify-center gap-1">
                                                    {plan.icon && (
                                                        <img
                                                            src={plan.icon}
                                                            alt={`${plan.title} icon`}
                                                            className="w-5 h-5 object-contain mr-1"
                                                        />
                                                    )}
                                                    {plan.title}
                                                </div>
                                                {priceLabel && (
                                                    <div className="text-xs text-white/90 mt-1">
                                                        {priceLabel}
                                                    </div>
                                                )}
                                                {isRecommended && (
                                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs py-0.5 px-2 rounded-full">
                                                        Recommended
                                                    </div>
                                                )}
                                                {plan.title === currentPlanTitle && (
                                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs py-0.5 px-2 rounded-full">
                                                        Current
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Plan Features */}
                                    {planFeatures.map((feature, index) => (
                                        <React.Fragment key={feature}>
                                            <div className={cn(
                                                "col-span-1 p-4 font-medium",
                                                index % 2 === 0 ? "bg-muted/30" : "bg-background"
                                            )}>
                                                {feature}
                                            </div>
                                            {visiblePlans.map((plan) => {
                                                // Get feature value, ensuring we don't exceed array bounds
                                                const value = index < plan.features.length
                                                    ? plan.features[index]
                                                    : '';

                                                // Determine how to render this value
                                                let displayValue;

                                                // Handle min_deposit (first row)
                                                if (index === 0 && !isNaN(Number(value.replace(/[€$,]/g, '')))) {
                                                    displayValue = formatCurrency(Number(value.replace(/[€$,]/g, '')));
                                                }
                                                // Handle checkmark entries
                                                else if (value === "Enabled" || value === "Yes") {
                                                    displayValue = <Check className="h-5 w-5 text-green-500" />;
                                                }
                                                // Default case
                                                else {
                                                    displayValue = value;
                                                }

                                                return (
                                                    <div
                                                        key={`${feature}-${plan.id}`}
                                                        className={cn(
                                                            "col-span-1 p-4 text-center",
                                                            index % 2 === 0 ? "bg-muted/30" : "bg-background",
                                                            user?.account_type?.id === plan.id ? "bg-primary/10" : "",
                                                            plan.title === currentPlanTitle ? "bg-primary/5" : ""
                                                        )}
                                                    >
                                                        {displayValue}
                                                    </div>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))}

                                    {/* Subscribe Action Row */}
                                    <div className="col-span-1 p-4 font-medium bg-background">
                                        Action
                                    </div>
                                    {visiblePlans.map((plan) => {
                                        const isCurrentPlan =
                                            user?.account_type?.id === plan.id ||
                                            plan.title === currentPlanTitle;
                                        const isSubscribing =
                                            subscribingPlanId === plan.id;
                                        const priceLabel = formatPlanPrice(plan.price);

                                        return (
                                            <div
                                                key={`subscribe-${plan.id}`}
                                                className={cn(
                                                    "col-span-1 p-4 bg-background",
                                                    isCurrentPlan ? "bg-primary/5" : ""
                                                )}
                                            >
                                                {isCurrentPlan ? (
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                        disabled
                                                    >
                                                        Current Plan
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        className="w-full"
                                                        onClick={() =>
                                                            openSubscribeConfirm(
                                                                plan.id,
                                                                plan.title,
                                                                priceLabel
                                                            )
                                                        }
                                                        disabled={!!subscribingPlanId}
                                                    >
                                                        {isSubscribing ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                Subscribing...
                                                            </>
                                                        ) : (
                                                            "Subscribe"
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>

            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Plan Subscription</DialogTitle>
                        <DialogDescription>
                            {selectedPlan
                                ? `You are about to subscribe to the ${selectedPlan.title} plan${selectedPlan.priceLabel ? ` (${selectedPlan.priceLabel})` : ""}. Do you want to continue?`
                                : "Do you want to continue?"}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsConfirmOpen(false)}
                            disabled={!!subscribingPlanId}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmSubscribe}
                            disabled={
                                !selectedPlan ||
                                (subscribingPlanId !== null &&
                                    subscribingPlanId === selectedPlan.id)
                            }
                        >
                            {selectedPlan && subscribingPlanId === selectedPlan.id ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Subscribing...
                                </>
                            ) : (
                                "Confirm Subscription"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog>
    );
}

export default AccountPlansModal;
