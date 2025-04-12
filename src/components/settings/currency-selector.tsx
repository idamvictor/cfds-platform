import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/hooks/useCurrency";
import { Loader2 } from "lucide-react";

export function CurrencySelector() {
    const { selectedCurrency, currencies, setSelectedCurrency, isLoading } = useCurrency();

    if (isLoading) {
        return (
            <div className="flex justify-center p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading currencies...
                </div>
            </div>
        );
    }

    if (!selectedCurrency || currencies.length === 0) {
        return (
            <div className="text-center text-muted-foreground p-4">
                No currencies available
            </div>
        );
    }

    return (
        <RadioGroup
            value={selectedCurrency.code}
            onValueChange={setSelectedCurrency}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
        >
            {currencies.map((curr) => (
                <div key={curr.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                        value={curr.code}
                        id={`currency-${curr.code}`}
                        className="border-primary/20"
                    />
                    <Label
                        htmlFor={`currency-${curr.code}`}
                        className="flex items-center gap-1 cursor-pointer"
                    >
                        <span className="w-5">{curr.icon}</span>
                        <span>{curr.code}</span>
                    </Label>
                </div>
            ))}
        </RadioGroup>
    );
}
