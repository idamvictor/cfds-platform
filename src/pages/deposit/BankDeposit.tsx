import TransactionHistory from "@/components/TransactionHistory";

const BankDeposit = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-trading-dark p-6 rounded-lg border border-border/20 mb-6">
        <h2 className="text-lg font-medium mb-4">Bank Transfer</h2>
        <div className="mb-4">
          <p className="text-muted mb-2">Bank Account Details:</p>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-muted/70">Bank Name:</span> Global Finance
              Bank
            </p>
            <p className="text-sm">
              <span className="text-muted/70">Account Name:</span> Capital
              Trading Ltd
            </p>
            <p className="text-sm">
              <span className="text-muted/70">Account Number:</span> 12345678900
            </p>
            <p className="text-sm">
              <span className="text-muted/70">SWIFT Code:</span> GLFIBANK
            </p>
          </div>
        </div>
      </div>

      <TransactionHistory />
    </div>
  );
};

export default BankDeposit;
