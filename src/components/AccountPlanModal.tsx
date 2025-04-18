import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, Star, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountPlan {
    name: string;
    headerClass: string;
    icon?: React.ReactNode;
    minimumDeposit: string;
    welcomeBonus: string;
    privateTraining: string;
    insuredTrading: string;
    leverage: string;
    tradingSignals: string;
    expediteWithdrawals: string;
    tradeRewards: string;
    vipAccess: string | React.ReactNode;
    recommended?: boolean;
}

interface AccountPlansModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const accountPlans: AccountPlan[] = [
    {
        name: "Basic",
        headerClass: "bg-red-500",
        minimumDeposit: "€553",
        welcomeBonus: "Up to 3%",
        privateTraining: "2 sessions / Month",
        insuredTrading: "None",
        leverage: "1:10",
        tradingSignals: "Weekly",
        expediteWithdrawals: "Up to 5 business days",
        tradeRewards: "None",
        vipAccess: "None",
    },
    {
        name: "Gold",
        headerClass: "bg-indigo-400",
        minimumDeposit: "€12,732",
        welcomeBonus: "Up to 5%",
        privateTraining: "4 sessions / Month",
        insuredTrading: "Account Manager discretion",
        leverage: "1:50",
        tradingSignals: "3 per Week",
        expediteWithdrawals: "Up to 3 business days",
        tradeRewards: "Up to €1000 in rewards",
        vipAccess: "Special Events Only",
    },
    {
        name: "Pro",
        headerClass: "bg-gradient-to-r from-blue-400 to-blue-600",
        icon: <Star className="h-4 w-4 text-white" />,
        minimumDeposit: "€50,325",
        welcomeBonus: "Up to 8%",
        privateTraining: "6 sessions / Month",
        insuredTrading: "Account Manager discretion",
        leverage: "1:100",
        tradingSignals: "Daily",
        expediteWithdrawals: "Within 24 hours",
        tradeRewards: "Up to €5000 in rewards",
        vipAccess: <Check className="h-5 w-5 text-green-500" />,
        recommended: true,
    },
    {
        name: "VIP",
        headerClass: "bg-gradient-to-r from-yellow-400 to-amber-500",
        icon: <Crown className="h-4 w-4 text-white" />,
        minimumDeposit: "€98,000",
        welcomeBonus: "Up to 10%",
        privateTraining: "8 sessions / Month",
        insuredTrading: "Customed",
        leverage: "1:200",
        tradingSignals: "Daily",
        expediteWithdrawals: "Immediate",
        tradeRewards: "Up to €10000 in rewards",
        vipAccess: <Check className="h-5 w-5 text-green-500" />,
    },
];

const planFeatures = [
    { id: "deposit", label: "Minimum Deposit: € / $ / £", accessor: "minimumDeposit" },
    { id: "bonus", label: "Welcome Bonus", accessor: "welcomeBonus" },
    { id: "training", label: "Private Training", accessor: "privateTraining" },
    { id: "insured", label: "Insured Trading", accessor: "insuredTrading" },
    { id: "leverage", label: "Leverage", accessor: "leverage" },
    { id: "signals", label: "Trading Signals", accessor: "tradingSignals" },
    { id: "withdrawals", label: "Expedite Withdrawals", accessor: "expediteWithdrawals" },
    { id: "rewards", label: "Trade Nation Trade Rewards", accessor: "tradeRewards" },
    { id: "vip", label: "Access to VIP Room", accessor: "vipAccess" },
];

export function AccountPlansModal({ open, onOpenChange }: AccountPlansModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-5xl p-0 overflow-hidden bg-background border-border max-h-[90vh] overflow-y-auto">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Account Plans
                    </DialogTitle>
                </DialogHeader>
                <div className="p-4 overflow-x-auto">
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-5 gap-px bg-muted/30 rounded-lg overflow-hidden shadow-sm">
                            {/* Headers */}
                            <div className="col-span-1 bg-background p-4 font-medium"></div>
                            {accountPlans.map((plan) => (
                                <div
                                    key={`header-${plan.name}`}
                                    className={cn(
                                        "col-span-1 text-center p-3 text-white font-semibold relative",
                                        plan.headerClass
                                    )}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        {plan.name} {plan.icon && <span className="ml-1">{plan.icon}</span>}
                                    </div>
                                    {plan.recommended && (
                                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs py-0.5 px-2 rounded-full">
                                            Recommended
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Plan Features */}
                            {planFeatures.map((feature, index) => (
                                <React.Fragment key={feature.id}>
                                    <div className={cn(
                                        "col-span-1 p-4 font-medium",
                                        index % 2 === 0 ? "bg-muted/30" : "bg-background"
                                    )}>
                                        {feature.label}
                                    </div>
                                    {accountPlans.map((plan) => {
                                        const value = plan[feature.accessor as keyof AccountPlan];
                                        return (
                                            <div
                                                key={`${feature.id}-${plan.name}`}
                                                className={cn(
                                                    "col-span-1 p-4 text-center",
                                                    index % 2 === 0 ? "bg-muted/30" : "bg-background",
                                                    typeof value !== 'string' && "flex items-center justify-center"
                                                )}
                                            >
                                                {value}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}

                            {/* Action Buttons */}
                            <div className="col-span-1 p-4 bg-background"></div>

                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AccountPlansModal;
