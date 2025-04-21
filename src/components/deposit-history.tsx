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
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Transaction {
  id: string;
  amount: string;
  date: string;
  type: string;
  status: string;
  details: string | null;
}

interface ApiResponse {
  status: string;
  message: string;
  data: {
    current_page: number;
    data: Transaction[];
    first_page_url: string;
    from: number;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
  };
}

const DepositHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get<ApiResponse>("/user/deposits");
        setTransactions(response.data.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to load deposit history");
        console.error("Error fetching deposits:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="mt-12">
      <h2 className="text-lg font-medium mb-6">Deposit History</h2>

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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
                  <p>Loading deposit history...</p>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-destructive">
                  {error}
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No deposit history found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id} className="bg-card/50 hover:bg-card">
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell className="capitalize">{tx.type}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setSelectedTransaction(tx);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <Info className="h-4 w-4" />
                      <span>View Details</span>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs",
                        tx.status === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : tx.status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      )}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deposit Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {selectedTransaction.details &&
                  (() => {
                    try {
                      const details =
                        typeof selectedTransaction.details === "string"
                          ? JSON.parse(selectedTransaction.details)
                          : selectedTransaction.details;

                      return Object.entries(details).map(([key, value]) => (
                        <div key={key} className="contents">
                          <div className="font-medium capitalize">
                            {key.replace(/_/g, " ")}:
                          </div>
                          <div className="text-muted-foreground">
                            {String(value)}
                          </div>
                        </div>
                      ));
                    } catch (error) {
                      console.error("Error parsing details:", error);
                      return (
                        <div className="col-span-2 text-muted-foreground text-center">
                          Unable to display additional details
                        </div>
                      );
                    }
                  })()}
                {!selectedTransaction.details && (
                  <div className="col-span-2 text-muted-foreground text-center">
                    No additional details available
                  </div>
                )}
                <div className="font-medium">Status:</div>
                <div>
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs",
                      selectedTransaction.status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : selectedTransaction.status === "rejected"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    )}
                  >
                    {selectedTransaction.status.charAt(0).toUpperCase() +
                      selectedTransaction.status.slice(1)}
                  </span>
                </div>
                <div className="font-medium">Amount:</div>
                <div className="text-muted-foreground">
                  {selectedTransaction.amount}
                </div>
                <div className="font-medium">Date:</div>
                <div className="text-muted-foreground">
                  {selectedTransaction.date}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepositHistory;
