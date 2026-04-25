import { useState, useCallback, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import useAssetStore from "@/store/assetStore";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/store/assetStore";
import AssetCategory from "@/components/trading/trading-interface-components/panels/inc/AssetCategory.tsx";
import { useMarketWatchSyntheticTicker } from "@/hooks/useMarketWatchSyntheticTicker";

interface MarketWatchPanelProps {
    addCurrencyPair: (pair: string) => void;
}

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

    // Expand categories when they first load
    // useEffect(() => {
    //     const categories = Object.keys(groupedAssets);
    //     if (categories.length > 0 && expandedCategories.length === 0) {
    //         setExpandedCategories(categories);
    //     }
    // }, [groupedAssets, expandedCategories.length]);

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
    const visibleAssets = useMemo(
        () => Object.values(filteredAssets).flat(),
        [filteredAssets]
    );
    const { getDisplayQuote } = useMarketWatchSyntheticTicker(visibleAssets);

    const hasResults = Object.keys(filteredAssets).length > 0;

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center text-[#eef2f7]" style={{ background: "linear-gradient(135deg,#07080c 0%,#0a0d15 100%)" }}>
                <div className="text-[#8b97a8]">Loading assets...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center p-4 text-[#eef2f7]" style={{ background: "linear-gradient(135deg,#07080c 0%,#0a0d15 100%)" }}>
                <div className="text-red-500 text-center">
                    <p className="mb-2 font-medium">Failed to load assets</p>
                    <p className="text-sm text-[#8b97a8]">{error}</p>
                    <Button
                        variant="outline"
                        className="mt-4 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[#eef2f7] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#eef2f7]"
                        onClick={() => useAssetStore.getState().fetchAssets()}
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full text-[#eef2f7]" style={{ background: "linear-gradient(135deg,#07080c 0%,#0a0d15 100%)" }}>
            <div className="p-2 border-b border-[rgba(255,255,255,0.06)]">
                <div className="mb-4 ml-4 mt-2">
                    <h2 className="text-sm font-medium text-[#eef2f7]">Market Watch</h2>
                </div>
                <div className="relative">
                    <Search className="absolute left-2  top-2.5 h-4 w-4 text-[#8b97a8]" />
                    <Input
                        placeholder="Search..."
                        className="pl-8 bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.06)] text-[#eef2f7] placeholder:text-[#4a5468] focus-visible:border-[#00dfa2] focus-visible:ring-[rgba(0,223,162,0.15)]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="p-2 overflow-y-auto h-[calc(100%-80px)]">
                {!hasResults ? (
                    <div className="text-center text-[#8b97a8] py-4">
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
                            getDisplayQuote={getDisplayQuote}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default MarketWatchPanel;
