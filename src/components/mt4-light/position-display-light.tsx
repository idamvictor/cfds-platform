import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import useTradeStore from "@/store/tradeStore";
import type { Trade } from "@/store/tradeStore";
import { cn } from "@/lib/utils";
// import { useMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import DesktopPositionTable from "../mt4/position-display/desktop-positionTable";
import ClosePositionDialog from "../mt4/position-display/close-position-dialog";

export default function PositionDisplayLight() {
  // UI state
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Trade | null>(null);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closingTrade, setClosingTrade] = useState(false);

  // const isMobile = useMobile(768);

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
    <div className="flex flex-col text-slate-900 w-full relative">
      <div className="relative">
        {/* Expanded view with slide animation */}
        <div
          className={cn(
            "transform transition-all duration-300 ease-in-out",
            isCollapsed ? "h-0 opacity-0" : "h-[190px] opacity-100"
          )}
        >
          <div className="h-[190px] relative bg-white shadow-lg backdrop-blur-sm">
            <div className="absolute inset-0 overflow-auto">
              <DesktopPositionTable
                positions={activeTab === "active" ? openTrades : closedTrades}
                isLoading={
                  activeTab === "active" ? isLoadingOpen : isLoadingClosed
                }
                error={activeTab === "active" ? errorOpen : errorClosed}
                activeTab={activeTab}
                loadMoreRef={loadMoreRef}
                handleClosePosition={
                  activeTab === "active" ? handleClosePosition : undefined
                }
              />
            </div>

            {/* control tabs */}
            <div className="flex justify-between items-center absolute bottom-0 left-0 right-0 z-20 bg-[#EDF0F4]">
              <div className="flex overflow-x-auto">
                <button
                  className={cn(
                    "rounded-none border-t-2 border-transparent px-4 py-2 whitespace-nowrap text-xs font-bold",
                    activeTab === "active"
                      ? "bg-white text-slate-900"
                      : "text-gray-500"
                  )}
                  onClick={() => setActiveTab("active")}
                >
                  Trade
                </button>
                <button
                  className={cn(
                    "rounded-none border-t-2 border-transparent px-4 py-2 whitespace-nowrap text-xs font-bold",
                    activeTab === "history"
                      ? "bg-white text-slate-900"
                      : "text-gray-500"
                  )}
                  onClick={() => setActiveTab("history")}
                >
                  Account History
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
          </div>
        </div>

        {/* Collapsed view with slide animation */}
        <div
          className={cn(
            "transform transition-all duration-300 ease-in-out absolute bottom-0 left-0 right-0",
            isCollapsed
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          )}
        >
          <div className="flex justify-between items-center bg-[#EDF0F4] relative z-10">
            <div className="flex overflow-x-auto">
              <button
                className={cn(
                  "rounded-none border-t-2 border-transparent px-4 py-2 whitespace-nowrap text-xs font-bold",
                  activeTab === "active"
                    ? "bg-white text-slate-900"
                    : "text-gray-500"
                )}
              >
                Trade
              </button>
              <button
                className={cn(
                  "rounded-none border-t-2 border-transparent px-4 py-2 whitespace-nowrap text-xs font-bold",
                  activeTab === "history"
                    ? "bg-white text-slate-900"
                    : "text-gray-500"
                )}
              >
                Account History
              </button>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-1 text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-2"
              >
                <span className="text-xs text-slate-900">Show Positions</span>
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

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
