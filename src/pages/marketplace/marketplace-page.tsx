
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


// Components
import MarketplaceCard from "@/components/marketplace/marketplace-card";
import MarketplaceFilters from "@/components/marketplace/marketplace-filters";

// Types and constants
import type { MarketplaceItem, CategoryFilter, SecondaryFilter } from "@/types/marketplace";
import {
    MARKETPLACE_ITEMS,
    CATEGORY_FILTERS,
    SECONDARY_FILTERS,
    DEFAULT_CATEGORY,
    DEFAULT_SECONDARY,
    filterByCategory,
    filterBySecondary,
    filterBySearch,
} from "@/constants/marketplace";

export default function MarketplacePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // State management
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(
        (searchParams.get("category") as CategoryFilter) || DEFAULT_CATEGORY
    );
    const [selectedSecondary, setSelectedSecondary] = useState<SecondaryFilter>(
        (searchParams.get("filter") as SecondaryFilter) || DEFAULT_SECONDARY
    );

    // Update URL parameters when filters change
    useEffect(() => {
        const params = new URLSearchParams();

        if (searchTerm) params.set("search", searchTerm);
        if (selectedCategory !== DEFAULT_CATEGORY) params.set("category", selectedCategory);
        if (selectedSecondary !== DEFAULT_SECONDARY) params.set("filter", selectedSecondary);

        setSearchParams(params, { replace: true });
    }, [searchTerm, selectedCategory, selectedSecondary, setSearchParams]);

    // Filtered items using memoization for performance
    const filteredItems = useMemo(() => {
        let filtered = MARKETPLACE_ITEMS;

        // Apply filters in sequence
        filtered = filterByCategory(filtered, selectedCategory);
        filtered = filterBySecondary(filtered, selectedSecondary);
        filtered = filterBySearch(filtered, searchTerm);

        return filtered;
    }, [searchTerm, selectedCategory, selectedSecondary]);

    // Handlers
    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const handleCategoryChange = useCallback((category: CategoryFilter) => {
        setSelectedCategory(category);
    }, []);

    const handleSecondaryChange = useCallback((filter: SecondaryFilter) => {
        setSelectedSecondary(filter);
    }, []);

    const handleItemAction = useCallback((item: MarketplaceItem) => {
        if (item.status === "purchased") {
            // Navigate to item details or show "already purchased" message
            console.log("Already purchased:", item.title);
        } else {
            // Handle purchase logic - this will be replaced with actual API call
            console.log("Purchasing:", item.title);
        }
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <div className="container- mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-2">MARKET PLACE</h1>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search market place"
                            className="pl-10 bg-background border-border"
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filters */}
                <MarketplaceFilters
                    categoryFilters={CATEGORY_FILTERS}
                    secondaryFilters={SECONDARY_FILTERS}
                    selectedCategory={selectedCategory}
                    selectedSecondary={selectedSecondary}
                    onCategoryChange={handleCategoryChange}
                    onSecondaryChange={handleSecondaryChange}
                />

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {filteredItems.map((item) => (
                        <MarketplaceCard
                            key={item.id}
                            item={item}
                            onAction={handleItemAction}
                        />
                    ))}
                </div>

                {/* No Results */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No items found matching your criteria.</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory(DEFAULT_CATEGORY);
                                setSelectedSecondary(DEFAULT_SECONDARY);
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
