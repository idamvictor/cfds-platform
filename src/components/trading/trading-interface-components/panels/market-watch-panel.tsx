import { useState, useEffect, useCallback, memo } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import useAssetStore from "@/store/assetStore";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/store/assetStore";
import { useAssetWebSocket } from "@/hooks/useAssetWebsocket";
import AssetItem from "@/components/trading/trading-interface-components/panels/inc/AssetItem.tsx";

interface MarketWatchPanelProps {
    addCurrencyPair: (pair: string) => void;
}


const CategoryIcon = memo(({ category }: { category: string }) => {
    switch (category.toLowerCase()) {
        case "forex":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="6" y1="15" x2="18" y2="15"></line>
                    <path d="M9 11l3-8 3 8"></path>
                    <path d="M13 11l5 4-5 4"></path>
                </svg>
            );
        case "stocks":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" y1="1" x2="6" y2="4"></line>
                    <line x1="10" y1="1" x2="10" y2="4"></line>
                    <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
            );
        case "crypto":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.5 9.5c.5-1 1.5-2 2.5-2 2 0 3 1.5 3 3 0 1.5-1 2-2 3-1 1-1.5 2-1.5 3"></path>
                    <line x1="12" y1="19" x2="12" y2="19.01"></line>
                </svg>
            );
        default:
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>
            );
    }
});

interface AssetCategoryProps {
    category: string;
    assets: Asset[];
    isExpanded: boolean;
    toggleCategory: () => void;
    handleAssetClick: (asset: Asset) => void;
    activeAssetId?: string;
}

const AssetCategory = memo(({
                                category,
                                assets,
                                isExpanded,
                                toggleCategory,
                                handleAssetClick,
                                activeAssetId
                            }: AssetCategoryProps) => {
    // Format category name for display
    const formatCategoryName = (name: string) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    return (
        <div className="mb-1">
            <button
                className="flex items-center justify-between w-full p-2 text-sm hover:bg-muted/50 rounded-md"
                onClick={toggleCategory}
            >
                <div className="flex items-center">
                    <CategoryIcon category={category} />
                    <span className="font-medium ml-2">
            {formatCategoryName(category)}
          </span>
                </div>
                <div className="flex items-center">
          <span className="text-muted-foreground mr-2">
            {assets.length}
          </span>
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </div>
            </button>

            {isExpanded && (
                <div className="space-y-1 mt-1">
                    {assets.map((asset) => (
                        <AssetItem
                            key={asset.id}
                            asset={asset}
                            isActive={activeAssetId === asset.id}
                            onClick={() => handleAssetClick(asset)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

// Main Component
const MarketWatchPanel = ({ addCurrencyPair }: MarketWatchPanelProps) => {
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Use selectors to prevent unnecessary re-renders
    const groupedAssets = useAssetStore((state) => state.groupedAssets);
    const setActiveAsset = useAssetStore((state) => state.setActiveAsset);
    const activeAssetId = useAssetStore((state) => state.activeAsset?.id);
    const isLoading = useAssetStore((state) => state.isLoading);
    const error = useAssetStore((state) => state.error);

    // Initialize the WebSocket connection
    const { subscribeToAll } = useAssetWebSocket({
        onConnected: () => {
            subscribeToAll();
        }
    });

    // Expand categories when they first load
    useEffect(() => {
        const categories = Object.keys(groupedAssets);
        if (categories.length > 0 && expandedCategories.length === 0) {
            setExpandedCategories(categories);
        }
    }, [groupedAssets, expandedCategories.length]);

    // Toggle category expansion
    const toggleCategory = useCallback((category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    }, []);

    // Handle asset selection
    const handleAssetClick = useCallback((asset: Asset) => {
        setActiveAsset(asset);
        addCurrencyPair(asset.sy);
    }, [setActiveAsset, addCurrencyPair]);

    // Filter assets based on search term
    const filteredAssets = searchTerm.trim() === ""
        ? groupedAssets
        : Object.keys(groupedAssets).reduce((acc, category) => {
            const searchLower = searchTerm.toLowerCase();
            const filtered = groupedAssets[category].filter(asset =>
                asset.name.toLowerCase().includes(searchLower) ||
                asset.symbol.toLowerCase().includes(searchLower) ||
                asset.sy.toLowerCase().includes(searchLower)
            );

            if (filtered.length > 0) {
                acc[category] = filtered;
            }
            return acc;
        }, {} as Record<string, Asset[]>);

    const hasResults = Object.keys(filteredAssets).length > 0;

    if (isLoading) {
        return (
            <div className="h-full bg-background flex items-center justify-center">
                <div className="text-muted-foreground">Loading assets...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full bg-background flex items-center justify-center p-4">
                <div className="text-destructive text-center">
                    <p className="mb-2 font-medium">Failed to load assets</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => useAssetStore.getState().fetchAssets()}
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-background">
            <div className="p-4 border-b border-border">
                <h2 className="text-sm font-medium mb-2">Market Watch</h2>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="p-2 overflow-y-auto h-[calc(100%-80px)]">
                {!hasResults ? (
                    <div className="text-center text-muted-foreground py-4">
                        No assets found
                    </div>
                ) : (
                    Object.keys(filteredAssets).map((category) => (
                        <AssetCategory
                            key={category}
                            category={category}
                            assets={filteredAssets[category]}
                            isExpanded={expandedCategories.includes(category)}
                            toggleCategory={() => toggleCategory(category)}
                            handleAssetClick={handleAssetClick}
                            activeAssetId={activeAssetId}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

// Add display names for debugging
AssetCategory.displayName = "AssetCategory";
CategoryIcon.displayName = "CategoryIcon";

export default MarketWatchPanel;
