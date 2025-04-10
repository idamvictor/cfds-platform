import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import useAssetStore from "@/store/assetStore";

interface MarketWatchPanelProps {
  addCurrencyPair: (pair: string) => void;
}

export default function MarketWatchPanel({
  addCurrencyPair,
}: MarketWatchPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "forex",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    groupedAssets,
    assets,
    setActiveAsset,
    activeAsset,
    isLoading,
    error,
  } = useAssetStore();

  console.log("Market Watch Panel - assets:", assets);
  console.log("Market Watch Panel - groupedAssets:", groupedAssets);
  console.log("Market Watch Panel - activeAsset:", activeAsset);
  console.log("Market Watch Panel - isLoading:", isLoading);
  console.log("Market Watch Panel - error:", error);

  // Expand all categories by default when assets are loaded
  useEffect(() => {
    if (Object.keys(groupedAssets).length > 0) {
      console.log("Expanding categories:", Object.keys(groupedAssets));
      setExpandedCategories(Object.keys(groupedAssets));
    }
  }, [groupedAssets]);

  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter((c) => c !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  const handleAssetClick = (asset: any) => {
    setActiveAsset(asset);
    addCurrencyPair(asset.symbol_display);
  };

  // Filter assets based on search term
  const filteredAssets =
    searchTerm.trim() === ""
      ? groupedAssets
      : Object.keys(groupedAssets).reduce((acc, category) => {
          const filtered = groupedAssets[category].filter(
            (asset) =>
              asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
              asset.symbol_display
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          );
          if (filtered.length > 0) {
            acc[category] = filtered;
          }
          return acc;
        }, {} as Record<string, any[]>);

  // Format category names for display
  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

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
        {Object.keys(filteredAssets).length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No assets found
          </div>
        ) : (
          Object.keys(filteredAssets).map((category) => (
            <div key={category} className="mb-1">
              <button
                className="flex items-center justify-between w-full p-2 text-sm hover:bg-muted/50 rounded-md"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center">
                  <CategoryIcon category={category} />
                  <span className="font-medium ml-2">
                    {formatCategoryName(category)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">
                    {filteredAssets[category].length}
                  </span>
                  {expandedCategories.includes(category) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </button>

              {expandedCategories.includes(category) && (
                <div className="space-y-1 mt-1">
                  {filteredAssets[category].map((asset) => (
                    <div
                      key={asset.id}
                      className={`flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer ml-2 ${
                        activeAsset?.id === asset.id ? "bg-primary/10" : ""
                      }`}
                      onClick={() => handleAssetClick(asset)}
                    >
                      <div className="flex items-center">
                        <AssetIcon asset={asset} />
                        <span className="ml-2 text-sm">
                          {asset.symbol_display}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">
                          {Number.parseFloat(asset.rate).toFixed(2)}
                        </span>
                        {asset.change_percent && (
                          <span
                            className={`text-xs ${
                              Number.parseFloat(asset.change_percent) >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {Number.parseFloat(asset.change_percent) >= 0
                              ? "+"
                              : ""}
                            {asset.change_percent}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CategoryIcon({ category }: { category: string }) {
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
}

function AssetIcon({ asset }: { asset: any }) {
  // Use the image from the asset if available
  if (asset.image) {
    return (
      <div
        className="h-5 w-5 rounded-full flex items-center justify-center text-xs text-white"
        style={{
          backgroundImage: `url(${asset.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!asset.image.includes("http") && asset.symbol.charAt(0)}
      </div>
    );
  }

  // Fallback to colored circle with first letter
  let color = "bg-blue-500";

  if (asset.type === "forex") {
    const firstCurrency = asset.symbol;
    color =
      firstCurrency === "AUD"
        ? "bg-blue-500"
        : firstCurrency === "EUR"
        ? "bg-yellow-500"
        : firstCurrency === "USD"
        ? "bg-green-500"
        : firstCurrency === "GBP"
        ? "bg-purple-500"
        : firstCurrency === "CAD"
        ? "bg-red-500"
        : firstCurrency === "CHF"
        ? "bg-red-500"
        : "bg-purple-500";
  } else if (asset.type === "crypto") {
    color =
      asset.symbol === "BTC"
        ? "bg-orange-500"
        : asset.symbol === "ETH"
        ? "bg-purple-500"
        : asset.symbol === "XRP"
        ? "bg-blue-500"
        : asset.symbol === "SOL"
        ? "bg-green-500"
        : asset.symbol === "ADA"
        ? "bg-blue-400"
        : "bg-gray-500";
  } else if (asset.type === "stocks") {
    color = "bg-blue-600";
  }

  return (
    <div
      className={`h-5 w-5 rounded-full ${color} flex items-center justify-center text-xs text-white`}
    >
      {asset.symbol.charAt(0)}
    </div>
  );
}
