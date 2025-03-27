const OtherDeposit = () => {
  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Other Deposit Methods</h2>
      <p className="text-muted mb-4">
        Please contact support for assistance with alternative deposit methods.
      </p>

      <div className="bg-trading-darker/50 p-4 rounded-lg border border-border/10 mb-6">
        <h3 className="text-sm font-medium mb-2">Contact Information</h3>
        <p className="text-sm text-muted">Email: support@trading.com</p>
        <p className="text-sm text-muted">Phone: +1 (800) 555-0199</p>
      </div>

      <button className="bg-trading-green text-white font-medium py-2 px-6 rounded-md transition-all">
        Contact Support
      </button>
    </div>
  );
};

export default OtherDeposit;
