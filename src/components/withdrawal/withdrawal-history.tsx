import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WithdrawalRequest {
  id: string;
  amount: string;
  date: string;
  type: string;
  account: string;
  status: string;
  details: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: {
    current_page: number;
    data: WithdrawalRequest[];
    first_page_url: string;
    from: number;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
  };
}

interface WithdrawalHistoryProps {
  refreshTrigger?: number;
}

export function WithdrawalHistory({
  refreshTrigger = 0,
}: WithdrawalHistoryProps) {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<WithdrawalRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await axiosInstance.get<ApiResponse>(
          "/user/withdrawals"
        );
        setWithdrawals(response.data.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to load withdrawal history");
        console.error("Error fetching withdrawals:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawals();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0a0d15] hover:bg-[#0a0d15] border-b border-white/[0.04]">
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">DATE</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                AMOUNT
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">TYPE</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">ACCOUNT</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                DETAILS
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                STATUS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-white/[0.04]">
              <TableCell colSpan={5} className="text-center py-10">
                <div className="animate-spin rounded-full h-7 w-7 border-2 border-[#131a28] border-t-[#00dfa2] mx-auto"></div>
                <p className="mt-3 text-xs text-[#4a5468]">Loading withdrawal history...</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return <div className="glass-card p-6 text-center text-sm text-[#ff5876]">{error}</div>;
  }

  return (
    <>
      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0a0d15] hover:bg-[#0a0d15] border-b border-white/[0.04]">
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">DATE</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                AMOUNT
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">TYPE</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">ACCOUNT</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                DETAILS
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#4a5468]">
                STATUS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.length === 0 ? (
              <TableRow className="border-b border-white/[0.04]">
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-xs text-[#4a5468]"
                >
                  No withdrawal history found
                </TableCell>
              </TableRow>
            ) : (
              withdrawals.map((request) => (
                <TableRow key={request.id} className="border-b border-white/[0.04] bg-transparent hover:bg-white/[0.02] transition-colors duration-150">
                  <TableCell className="text-xs text-[#7a8899] font-mono">
                    {request.date}
                  </TableCell>
                  <TableCell className="text-sm font-bold text-[#eef2f7] font-mono">{request.amount}</TableCell>
                  <TableCell className="capitalize text-xs text-[#a8b5c8]">{request.type}</TableCell>
                  <TableCell className="capitalize text-xs text-[#a8b5c8]">{request.account}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1.5 text-[#4a5468] hover:text-[#00dfa2] hover:bg-[#00dfa2]/[0.06] rounded-lg transition-colors duration-150"
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <Info className="h-3.5 w-3.5" />
                      <span className="text-xs font-semibold">View</span>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={request.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md border-white/[0.08] bg-[#0f1220] shadow-[0_24px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-white">Withdrawal Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm rounded-xl bg-[#0a0d15] p-4 border border-white/[0.04]">
                {selectedRequest.details &&
                  (() => {
                    try {
                      const details =
                        typeof selectedRequest.details === "string"
                          ? JSON.parse(selectedRequest.details)
                          : selectedRequest.details;

                      return Object.entries(details).map(([key, value]) => (
                        <div key={key} className="contents">
                          <div className="text-xs font-semibold capitalize text-[#4a5468]">
                            {key.replace(/_/g, " ")}:
                          </div>
                          <div className="text-xs text-[#a8b5c8] break-all font-mono">
                            {String(value)}
                          </div>
                        </div>
                      ));
                    } catch (error) {
                      console.error("Error parsing details:", error);
                      return (
                        <div className="col-span-2 text-xs text-[#ff5876]">
                          Unable to display additional details
                        </div>
                      );
                    }
                  })()}
                <div className="text-xs font-semibold text-[#4a5468]">Status:</div>
                <div>
                  <StatusBadge status={selectedRequest.status} />
                </div>
                <div className="text-xs font-semibold text-[#4a5468]">Amount:</div>
                <div className="text-xs text-[#a8b5c8] font-mono font-bold">
                  {selectedRequest.amount}
                </div>
                <div className="text-xs font-semibold text-[#4a5468]">Date:</div>
                <div className="text-xs text-[#a8b5c8] font-mono">
                  {selectedRequest.date}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="rounded-xl border-white/[0.08] bg-[#131a28] text-[#8b97a8] transition-all duration-200 hover:border-white/[0.14] hover:bg-[#1a2438] hover:text-white"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 rounded-full border-[#FF9800]/30 bg-[#FF9800]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#FF9800]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF9800] animate-pulse" />
          Pending
        </Badge>
      );
    case "completed":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 rounded-full border-[#00dfa2]/30 bg-[#00dfa2]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#00dfa2]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#00dfa2]" />
          Completed
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 rounded-full border-[#ff5876]/30 bg-[#ff5876]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#ff5876]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff5876]" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="rounded-full border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-bold text-[#8b97a8]">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
  }
}
