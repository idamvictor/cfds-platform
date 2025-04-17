import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import useTradeStore from "@/store/tradeStore";
import type { Trade } from "@/store/tradeStore";

import DesktopTradeTable from "@/components/trading/partials/DesktopTradeTable";
import AccountSummary from "@/components/trading/partials/AccountSummary";
import ClosePositionDialog from "@/components/trading/partials/ClosePositionDialog";
import MobileFilterDialog from "@/components/trading/partials/MobileFilterDialog";
import MobileSheet from "@/components/trading/partials/MobileSheet";

export default function OrderTable() {
  // UI state
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Trade | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  // const [showAccountDetails, setShowAccountDetails] = useState(false);

  const isMobile = useMobile(768);

  // Get trade data directly from the store
  const {
    openTrades,
    closedTrades,
    accountSummary,
    isLoadingOpen,
    isLoadingClosed,
    errorOpen,
    errorClosed,
    fetchMoreOpenTrades,
    fetchMoreClosedTrades,
    hasMoreOpenTrades,
    hasMoreClosedTrades,
  } = useTradeStore();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Setup intersection observer for infinite scrolling
  const lastElementRef = useCallback(() => {
    const isLoading = activeTab === "active" ? isLoadingOpen : isLoadingClosed;
    const hasMore =
      activeTab === "active" ? hasMoreOpenTrades() : hasMoreClosedTrades();
    const fetchMore =
      activeTab === "active" ? fetchMoreOpenTrades : fetchMoreClosedTrades;

    if (isLoading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMore();
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [
    activeTab,
    isLoadingOpen,
    isLoadingClosed,
    hasMoreOpenTrades,
    hasMoreClosedTrades,
    fetchMoreOpenTrades,
    fetchMoreClosedTrades,
  ]);

  // Set up the observer when component mounts or tab changes
  useEffect(() => {
    lastElementRef();
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lastElementRef, activeTab, openTrades, closedTrades]);

  const handleClosePosition = (order: Trade) => {
    setSelectedOrder(order);
    setShowCloseDialog(true);
  };

  const confirmClose = () => {
    // Logic to close the position would go here
    // In a real implementation, you would call an API endpoint
    setShowCloseDialog(false);
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="flex flex-col bg-background text-foreground border border-muted shadow-sm w-full">
      {!isCollapsed && !isMobile && (
        <div className="flex-1">
          <div className="border-b border-muted flex justify-between items-center sticky top-0 z-20 bg-background">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button
                className={cn(
                  "rounded-none border-b-2 border-transparent px-4 py-2 whitespace-nowrap text-xs",
                  activeTab === "active"
                    ? "border-primary text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setActiveTab("active")}
              >
                ACTIVE ORDERS
              </button>
              <button
                className={cn(
                  "rounded-none border-b-2 border-transparent px-4 py-2 whitespace-nowrap text-xs",
                  activeTab === "history"
                    ? "border-primary text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setActiveTab("history")}
              >
                ORDERS HISTORY
              </button>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 mr-2"
                onClick={() => setIsCollapsed(true)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DesktopTradeTable
            trades={activeTab === "active" ? openTrades : closedTrades}
            isLoading={activeTab === "active" ? isLoadingOpen : isLoadingClosed}
            error={activeTab === "active" ? errorOpen : errorClosed}
            activeTab={activeTab}
            loadMoreRef={loadMoreRef}
            handleClosePosition={
              activeTab === "active" ? handleClosePosition : undefined
            }
          />
        </div>
      )}

      {/* Account summary section */}
      <div className="sticky bottom-0 z-20 bg-background">
        {isMobile ? (
          <AccountSummary
            accountData={accountSummary}
            isDesktop={false}
            // showAccountDetails={showAccountDetails}
            // setShowAccountDetails={setShowAccountDetails}
          >
            <MobileSheet
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setShowFilters={setShowFilters}
              openTrades={openTrades}
              closedTrades={closedTrades}
              isLoadingOpen={isLoadingOpen}
              isLoadingClosed={isLoadingClosed}
              expandedOrderId={expandedOrderId}
              toggleOrderExpand={toggleOrderExpand}
              loadMoreRef={loadMoreRef}
              handleClosePosition={handleClosePosition}
            />
          </AccountSummary>
        ) : (
          <AccountSummary
            accountData={accountSummary}
            isDesktop={true}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        )}
      </div>

      <MobileFilterDialog open={showFilters} onOpenChange={setShowFilters} />

      <ClosePositionDialog
        open={showCloseDialog}
        onOpenChange={setShowCloseDialog}
        selectedOrder={selectedOrder}
        onConfirm={confirmClose}
      />
    </div>
  );
}
