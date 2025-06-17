
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MarketplaceItem } from "@/types/marketplace";

interface MarketplaceCardProps {
    item: MarketplaceItem;
    onAction: (item: MarketplaceItem) => void;
}

export default function MarketplaceCard({ item, onAction }: MarketplaceCardProps) {
    // Render star rating
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <div
                        key={star}
                        className={cn(
                            "w-3 h-3 text-xs",
                            star <= rating ? "text-yellow-400" : "text-gray-300"
                        )}
                    >
                        ★
                    </div>
                ))}
            </div>
        );
    };

    // Generate gradient based on item id for visual variety
    const getGradient = (id: string) => {
        const gradients = [
            "from-blue-600 via-purple-600 to-blue-800",
            "from-green-600 via-teal-600 to-green-800",
            "from-purple-600 via-pink-600 to-purple-800",
            "from-orange-600 via-red-600 to-orange-800",
            "from-indigo-600 via-blue-600 to-indigo-800",
        ];
        const index = parseInt(id) % gradients.length;
        return gradients[index];
    };

    return (
        <Card
            className="bg-card border-border hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group"
            onClick={() => onAction(item)}
        >
            <div className="relative">
                {/* Item Image with gradient background */}
                <div className={cn(
                    "aspect-[4/3] bg-gradient-to-br relative overflow-hidden",
                    getGradient(item.id)
                )}>
                    {item.badge && (
                        <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 z-10">
                            {item.badge}
                        </Badge>
                    )}

                    {/* Status indicator for purchased items */}
                    {item.status === "purchased" && (
                        <Badge className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 z-10">
                            Owned
                        </Badge>
                    )}

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-center px-4">
                            <div className="text-lg font-bold mb-1 leading-tight">{item.title}</div>
                            <div className="text-xs opacity-80">Expert Advisors</div>
                        </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
            </div>

            <CardContent className="p-4">
                {/* Title and Rating */}
                <div className="mb-3">
                    <h3 className="font-semibold text-foreground text-sm mb-1 truncate" title={item.title}>
                        {item.title}
                    </h3>
                    <div className="flex items-center justify-between">
                        {renderStars(item.rating)}
                        {item.downloads && (
                            <span className="text-xs text-muted-foreground">
                {item.downloads.toLocaleString()} downloads
              </span>
                        )}
                    </div>
                </div>


                {/* Price and Action */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="text-lg font-bold text-foreground">
                            {item.price === 0 ? "Free" : `${item.price.toLocaleString()} ${item.currency}`}
                        </div>
                        {item.paymentType === "monthly" && (
                            <span className="text-xs text-muted-foreground">/month</span>
                        )}
                    </div>

                    <Button
                        size="sm"
                        variant={item.status === "purchased" ? "outline" : "default"}
                        className={cn(
                            "px-4 py-1 text-xs font-medium",
                            item.status === "purchased"
                                ? "bg-transparent text-muted-foreground border-border cursor-default"
                                : "bg-green-600 text-white hover:bg-green-700"
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(item);
                        }}
                        disabled={item.status === "purchased"}
                    >
                        {item.status === "purchased" ? "Purchased" : "Purchase"}
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
}
