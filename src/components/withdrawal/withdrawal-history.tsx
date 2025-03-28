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

type WithdrawalStatus = "pending" | "completed" | "rejected";

interface WithdrawalRequest {
  id: string;
  time: string;
  amount: string;
  currency: string;
  info: string;
  status: WithdrawalStatus;
}

const withdrawalRequests: WithdrawalRequest[] = [
  {
    id: "wd-001",
    time: "2025-03-27 14:32",
    amount: "0.05",
    currency: "BTC",
    info: "Withdrawal to wallet address 3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
    status: "completed",
  },
  {
    id: "wd-002",
    time: "2025-03-25 09:15",
    amount: "1.2",
    currency: "ETH",
    info: "Withdrawal to wallet address 0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    status: "completed",
  },
  {
    id: "wd-003",
    time: "2025-03-24 18:45",
    amount: "500",
    currency: "USDT",
    info: "Withdrawal to wallet address TKrV3XpGgPcqCvJVvHmez8Hn5hcDTSQVJp",
    status: "pending",
  },
  {
    id: "wd-004",
    time: "2025-03-20 11:22",
    amount: "1000",
    currency: "USD",
    info: "Bank transfer to account ending in 4582",
    status: "rejected",
  },
];

export function WithdrawalHistory() {
  return (
    <div className="rounded-md border border-border/40 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-card hover:bg-card">
            <TableHead className="text-foreground font-bold">TIME</TableHead>
            <TableHead className="text-foreground font-bold">AMOUNT</TableHead>
            <TableHead className="text-foreground font-bold">
              CURRENCY
            </TableHead>
            <TableHead className="text-foreground font-bold">INFO</TableHead>
            <TableHead className="text-foreground font-bold">STATUS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawalRequests.map((request) => (
            <TableRow key={request.id} className="bg-card/50 hover:bg-card">
              <TableCell className="text-muted-foreground">
                {request.time}
              </TableCell>
              <TableCell>{request.amount}</TableCell>
              <TableCell>{request.currency}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center cursor-help">
                        <Info className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-muted-foreground">Details</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{request.info}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <StatusBadge status={request.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: WithdrawalStatus }) {
  switch (status) {
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
      return null;
  }
}
