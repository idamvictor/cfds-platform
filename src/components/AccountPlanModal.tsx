import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import useDataStore from "@/store/dataStore";
import useUserStore from "@/store/userStore";
import { useCurrency } from "@/hooks/useCurrency";

interface AccountPlansModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AccountPlansModal({ open, onOpenChange }: AccountPlansModalProps) {
    const { data, isLoading } = useDataStore();
    const user = useUserStore((state) => state.user);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const { formatCurrency } = useCurrency();

    // Get current user's plan title if available
    const currentPlanTitle = user?.account_type?.name || "Basic";

    // Handle plan selection
    const handlePlanSelect = (planId: string) => {
        setSelectedPlanId(planId);
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
                ) : !data?.plans || data.plans.length === 0 ? (
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
                                    {data.plans.map((plan) => {
                                        const isRecommended = plan.title === "Pro";

                                        // Determine header background style using plan's color
                                        const headerStyle = {
                                            backgroundColor: plan.color || "gray"
                                        };

                                        return (
                                            <div
                                                key={`header-${plan.id}`}
                                                className={cn(
                                                    "col-span-1 text-center p-3 text-white font-semibold relative cursor-pointer",
                                                    selectedPlanId === plan.id ? "ring-2 ring-primary" : ""
                                                )}
                                                style={headerStyle}
                                                onClick={() => handlePlanSelect(plan.id)}
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
                                    {data.plan_features.map((feature, index) => (
                                        <React.Fragment key={feature}>
                                            <div className={cn(
                                                "col-span-1 p-4 font-medium",
                                                index % 2 === 0 ? "bg-muted/30" : "bg-background"
                                            )}>
                                                {feature}
                                            </div>
                                            {data.plans.map((plan) => {
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
                                                            selectedPlanId === plan.id ? "bg-primary/10" : "",
                                                            plan.title === currentPlanTitle ? "bg-primary/5" : ""
                                                        )}
                                                        onClick={() => handlePlanSelect(plan.id)}
                                                    >
                                                        {displayValue}
                                                    </div>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default AccountPlansModal;
