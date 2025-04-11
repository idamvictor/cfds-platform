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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WithdrawalRequest {
  id: string;
  amount: string;
  date: string;
  type: string;
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
      <div className="rounded-md border border-border/40 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-card hover:bg-card">
              <TableHead className="text-foreground font-bold">DATE</TableHead>
              <TableHead className="text-foreground font-bold">
                AMOUNT
              </TableHead>
              <TableHead className="text-foreground font-bold">TYPE</TableHead>
              <TableHead className="text-foreground font-bold">
                DETAILS
              </TableHead>
              <TableHead className="text-foreground font-bold">
                STATUS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
                <p>Loading withdrawal history...</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-destructive">{error}</div>;
  }

  return (
    <div className="rounded-md border border-border/40 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-card hover:bg-card">
            <TableHead className="text-foreground font-bold">DATE</TableHead>
            <TableHead className="text-foreground font-bold">AMOUNT</TableHead>
            <TableHead className="text-foreground font-bold">TYPE</TableHead>
            <TableHead className="text-foreground font-bold">DETAILS</TableHead>
            <TableHead className="text-foreground font-bold">STATUS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No withdrawal history found
              </TableCell>
            </TableRow>
          ) : (
            withdrawals.map((request) => {
              let details;
              try {
                details = JSON.parse(request.details);
              } catch {
                details = { error: "Unable to parse details" };
              }

              return (
                <TableRow key={request.id} className="bg-card/50 hover:bg-card">
                  <TableCell className="text-muted-foreground">
                    {request.date}
                  </TableCell>
                  <TableCell>{request.amount}</TableCell>
                  <TableCell className="capitalize">{request.type}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center cursor-help">
                            <Info className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-muted-foreground">
                              Details
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            {Object.entries(details).map(([key, value]) => (
                              <p key={key} className="capitalize">
                                {key.replace("_", " ")}: {value as string}
                              </p>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={request.status} />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        >
          Pending
        </Badge>
      );
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-success/10 text-success border-success/20"
        >
          Completed
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="outline"
          className="bg-destructive/10 text-destructive border-destructive/20"
        >
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
  }
}
