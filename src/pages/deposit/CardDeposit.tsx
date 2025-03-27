import TransactionHistory from "@/components/TransactionHistory";

const CardDeposit = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-trading-dark p-6 rounded-lg border border-border/20 mb-6">
        <h2 className="text-lg font-medium mb-4">Card Payment</h2>
        <div className="mb-4">
          <p className="text-muted mb-2">Enter your card details:</p>
          <form className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Card Number</label>
              <input
                type="text"
                className="w-full bg-trading-darker p-2 rounded border border-border/20"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Expiry Date</label>
                <input
                  type="text"
                  className="w-full bg-trading-darker p-2 rounded border border-border/20"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">CVV</label>
                <input
                  type="text"
                  className="w-full bg-trading-darker p-2 rounded border border-border/20"
                  placeholder="123"
                />
              </div>
            </div>
            <button className="bg-trading-green text-white font-medium py-2 px-6 rounded-md transition-all w-full">
              Process Payment
            </button>
          </form>
        </div>
      </div>

      <TransactionHistory />
    </div>
  );
};

export default CardDeposit;
