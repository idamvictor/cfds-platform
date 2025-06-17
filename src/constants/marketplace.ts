
import type { MarketplaceItem,  CategoryFilter, SecondaryFilter } from "@/types/marketplace";

export const CATEGORY_FILTERS: readonly { value: CategoryFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "expert-advisors", label: "Expert Advisors" },
    { value: "others", label: "Others" },
] as const;

export const SECONDARY_FILTERS: readonly { value: SecondaryFilter; label: string }[] = [
    { value: "popular", label: "Popular" },
    { value: "new", label: "New" },
    { value: "free", label: "Free" },
    { value: "monthly", label: "Monthly Payment" },
    { value: "one-time", label: "One Time Payment" },
    { value: "purchased", label: "My Purchased" },
] as const;

// Mock data that matches the UI in the image
export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
    {
        id: "1",
        title: "QuantEdge AI",
        description: "Advanced AI-powered trading algorithm with machine learning capabilities",
        price: 1500,
        currency: "USD",
        image: "/api/placeholder/300/200",
        category: "expert-advisors",
        paymentType: "one-time",
        status: "available",
        rating: 4,
        features: ["AI-Powered", "Risk Management", "Multi-Timeframe"],
        author: "Quant Solutions",
        downloads: 1234,
        version: "2.1.0",
        lastUpdated: "2024-01-15",
    },
    {
        id: "2",
        title: "Quant Bridge AI",
        description: "Quantum-based trading bridge technology for advanced market analysis",
        price: 1500,
        currency: "USD",
        image: "/api/placeholder/300/200",
        category: "expert-advisors",
        paymentType: "one-time",
        status: "purchased",
        rating: 4,
        features: ["Quantum Computing", "Real-time Analysis", "Auto-Trading"],
        author: "Bridge Tech",
        downloads: 892,
        version: "1.8.2",
        lastUpdated: "2024-01-10",
    },
    {
        id: "3",
        title: "ApexTrade Bot",
        description: "High-frequency trading bot with scalping strategies",
        price: 1500,
        currency: "USD",
        image: "/api/placeholder/300/200",
        category: "expert-advisors",
        paymentType: "one-time",
        status: "available",
        rating: 4,
        badge: "Expert Advisor",
        features: ["High Frequency", "Scalping", "News Trading"],
        author: "Apex Trading",
        downloads: 2156,
        version: "3.0.1",
        lastUpdated: "2024-01-20",
    },
    {
        id: "4",
        title: "BlackRock Algo Pro",
        description: "Professional algorithmic trading suite for institutional strategies",
        price: 1500,
        currency: "USD",
        image: "/api/placeholder/300/200",
        category: "expert-advisors",
        paymentType: "one-time",
        status: "purchased",
        rating: 4,
        badge: "Expert Advisor",
        features: ["Institutional Grade", "Portfolio Management", "Risk Control"],
        author: "BlackRock Systems",
        downloads: 3421,
        version: "4.2.0",
        lastUpdated: "2024-01-18",
    },
    {
        id: "5",
        title: "AlgoWealth Advisor",
        description: "Comprehensive wealth management algorithm for long-term growth",
        price: 1500,
        currency: "USD",
        image: "/api/placeholder/300/200",
        category: "expert-advisors",
        paymentType: "one-time",
        status: "available",
        rating: 4,
        badge: "Expert Advisor",
        features: ["Wealth Management", "Long-term Strategy", "Diversification"],
        author: "AlgoWealth",
        downloads: 1876,
        version: "2.5.3",
        lastUpdated: "2024-01-12",
    },
    // Second row - following same pattern
    {
        id: "6",
        title: "QuantEdge AI Pro",
        description: "Enhanced AI trading system with advanced machine learning",
        price: 1500,
        currency: "USD",
        image: "/api/placeholder/300/200",
        category: "expert-advisors",
        paymentType: "one-time",
        status: "available",
        rating: 4,
        features: ["Enhanced AI", "Deep Learning", "Pattern Recognition"],
        author: "Quant Solutions",
        downloads: 945,
        version: "3.1.0",
        lastUpdated: "2024-01-22",
    },
    {
        id: "7",
        title: "Quant Bridge Advanced",
        description: "Advanced quantum bridge technology with enhanced features",
        price: 1500,
        currency: "USD",
        image: "/api/placeholder/300/200",
        category: "expert-advisors",
        paymentType: "one-time",
        status: "available",
        rating: 4,
        features: ["Advanced Quantum", "Multi-Asset", "Cloud Integration"],
        author: "Bridge Tech",
        downloads: 723,
        version: "2.0.0",
        lastUpdated: "2024-01-25",
    },
    {
        id: "8",
        title: "ApexTrade Enterprise",
        description: "Enterprise-level trading solution for professional traders",
        price: 1500,
        currency: "USD",
        image: "/api/placeholder/300/200",
        category: "expert-advisors",
        paymentType: "one-time",
        status: "available",
        rating: 4,
        badge: "Expert Advisor",
        features: ["Enterprise Grade", "Multi-Account", "API Integration"],
        author: "Apex Trading",
        downloads: 1567,
        version: "4.0.2",
        lastUpdated: "2024-01-19",
    },
    {
        id: "9",
        title: "BlackRock Elite",
        description: "Elite trading algorithms for sophisticated market strategies",
        price: 1500,
        currency: "USD",
        image: "/api/placeholder/300/200",
        category: "expert-advisors",
        paymentType: "one-time",
        status: "available",
        rating: 4,
        badge: "Expert Advisor",
        features: ["Elite Strategies", "Market Making", "Arbitrage"],
        author: "BlackRock Systems",
        downloads: 2890,
        version: "5.1.1",
        lastUpdated: "2024-01-21",
    },
];

// Default filter values
export const DEFAULT_CATEGORY: CategoryFilter = "all";
export const DEFAULT_SECONDARY: SecondaryFilter = "popular";

// Filter functions for easier maintenance
export const filterByCategory = (items: MarketplaceItem[], category: CategoryFilter): MarketplaceItem[] => {
    if (category === "all") return items;
    return items.filter(item => item.category === category);
};

export const filterBySecondary = (items: MarketplaceItem[], filter: SecondaryFilter): MarketplaceItem[] => {
    switch (filter) {
        case "free":
            return items.filter(item => item.price === 0);
        case "monthly":
            return items.filter(item => item.paymentType === "monthly");
        case "one-time":
            return items.filter(item => item.paymentType === "one-time");
        case "purchased":
            return items.filter(item => item.status === "purchased");
        case "new":
            // Sort by lastUpdated descending
            return [...items].sort((a, b) =>
                new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime()
            );
        case "popular":
        default:
            // Sort by downloads descending
            return [...items].sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    }
};

export const filterBySearch = (items: MarketplaceItem[], searchTerm: string): MarketplaceItem[] => {
    if (!searchTerm.trim()) return items;

    const searchLower = searchTerm.toLowerCase();
    return items.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.author?.toLowerCase().includes(searchLower) ||
        item.features?.some(feature => feature.toLowerCase().includes(searchLower))
    );
};
