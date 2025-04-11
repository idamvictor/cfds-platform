import { memo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Asset } from "@/store/assetStore";
import AssetItem from "./AssetItem";

interface AssetCategoryProps {
    category: string;
    assets: Asset[];
    isExpanded: boolean;
    toggleCategory: () => void;
    handleAssetClick: (asset: Asset) => void;
    activeAssetId?: string;
}

// Category icon component
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

// Asset category component
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
        <div className="mb-2">
            <button
                className="flex items-center justify-between w-full p-2 text-sm font-medium hover:bg-muted/30 rounded-md"
                onClick={toggleCategory}
            >
                <div className="flex items-center">
                    <CategoryIcon category={category} />
                    <span className="ml-2">
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
                <div className="mt-1 space-y-1 bg-muted/10 rounded-md p-1">
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

// Add display names for debugging
CategoryIcon.displayName = "CategoryIcon";
AssetCategory.displayName = "AssetCategory";

export default AssetCategory;
