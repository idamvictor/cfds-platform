import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import useTradeStore from "@/store/tradeStore";
import type { Trade } from "@/store/tradeStore";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import DesktopPositionTable from "./DesktopPositionTable";
import ClosePositionDialog from "./ClosePositionDialog";

export default function PositionDisplay() {
  // UI state
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Trade | null>(null);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closingTrade, setClosingTrade] = useState(false);

  const isMobile = useMobile(768);

  // Get trade data from the store
  const {
    openTrades,
    closedTrades,
    isLoadingOpen,
    isLoadingClosed,
    errorOpen,
    errorClosed,
    fetchOpenTrades,
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

  const confirmClose = async () => {
    setClosingTrade(true);
    try {
      const response = await axiosInstance.post(
        "/trade/" + selectedOrder?.id + "/close"
      );
      console.log("Trade closed successfully:", response.data);
      await fetchOpenTrades();

      toast.success("Position successfully closed", {
        position: "bottom-left",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error closing trade:", error);
      toast.error("Failed to close trade", {
        description:
          "There was an error processing your request. Please try again.",
        position: "top-right",
        duration: 5000,
      });
    } finally {
      setClosingTrade(false);
      setShowCloseDialog(false);
    }
  };

  return (
    <div className="flex flex-col text-slate-300 w-full relative">
      {!isCollapsed && !isMobile && (
        <div className="h-[200px] overflow-hidden absolute bottom-full left-0 right-0 z-50 bg-slate-700/50 border border-slate-600 shadow-lg backdrop-blur-sm">
          <div className="border-b border-slate-600 flex justify-between items-center sticky top-0 z-20 bg-slate-700">
            <div className="flex overflow-x-auto">
              <button
                className={cn(
                  "rounded-none border-b-2 border-transparent px-4 py-2 whitespace-nowrap text-xs",
                  activeTab === "active"
                    ? "border-primary text-primary"
                    : "text-slate-400"
                )}
                onClick={() => setActiveTab("active")}
              >
                ACTIVE POSITIONS
              </button>
              <button
                className={cn(
                  "rounded-none border-b-2 border-transparent px-4 py-2 whitespace-nowrap text-xs",
                  activeTab === "history"
                    ? "border-primary text-primary"
                    : "text-slate-400"
                )}
                onClick={() => setActiveTab("history")}
              >
                POSITIONS HISTORY
              </button>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1 text-slate-400 hover:text-slate-300 transition-colors flex items-center"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <DesktopPositionTable
            positions={activeTab === "active" ? openTrades : closedTrades}
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

      {isCollapsed && (
        <div className="bg-slate-700/50 border border-slate-600 relative z-10">
          <Card className="rounded-none border-x-0 border-b-0 bg-slate-700/50 py-0">
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-slate-300">
                    Total Portfolio
                  </h3>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => setIsCollapsed(false)}
                    className="p-1 text-slate-400 hover:text-slate-300 transition-colors flex items-center"
                  >
                    <span className="text-sm text-slate-300 mr-2">
                      Show Positions
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <ClosePositionDialog
        open={showCloseDialog}
        onOpenChange={setShowCloseDialog}
        selectedOrder={selectedOrder}
        onConfirm={confirmClose}
        isClosing={closingTrade}
      />
    </div>
  );
}
