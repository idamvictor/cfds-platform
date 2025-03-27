import TransactionHistory from "@/components/TransactionHistory";

const PaypalDeposit = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-trading-dark p-6 rounded-lg border border-border/20 mb-6">
        <h2 className="text-lg font-medium mb-4">PayPal Deposit</h2>
        <div className="mb-4">
          <p className="text-muted mb-2">Connect your PayPal account:</p>
          <button className="bg-trading-green text-white font-medium py-2 px-6 rounded-md transition-all w-full">
            Connect with PayPal
          </button>
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <p className="text-sm text-muted/70">• Minimum deposit: $10</p>
          <p className="text-sm text-muted/70">• Processing time: Instant</p>
          <p className="text-sm text-muted/70">• PayPal fees may apply</p>
        </div>
      </div>

      <TransactionHistory />
    </div>
  );
};

export default PaypalDeposit;
