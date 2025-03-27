import React from "react";

interface Transaction {
  id: string;
  time: string;
  amount: string;
  currency: string;
  status: "Approved" | "Declined" | "Pending";
}

const TransactionHistory: React.FC = () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      time: "6/25/2024, 2:46:15 PM",
      amount: "$250.00",
      currency: "USD",
      status: "Approved",
    },
    {
      id: "2",
      time: "6/18/2024, 11:24:21 AM",
      amount: "$250.00",
      currency: "USD",
      status: "Declined",
    },
  ];

  return (
    <div className="mt-12">
      <h3 className="text-sm uppercase tracking-wider text-muted mb-4">
        Last Deposits
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-border/20">
              <th className="pb-3 text-muted font-medium">TIME</th>
              <th className="pb-3 text-muted font-medium">AMOUNT</th>
              <th className="pb-3 text-muted font-medium">CURRENCY</th>
              <th className="pb-3 text-muted font-medium">INFO</th>
              <th className="pb-3 text-muted font-medium">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-border/10 hover:bg-trading-dark/50 transition-colors"
              >
                <td className="py-4 text-sm">{tx.time}</td>
                <td className="py-4 text-sm">{tx.amount}</td>
                <td className="py-4 text-sm">{tx.currency}</td>
                <td className="py-4 text-sm">-</td>
                <td className="py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      tx.status === "Approved"
                        ? "bg-green-500/20 text-green-400"
                        : tx.status === "Declined"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
