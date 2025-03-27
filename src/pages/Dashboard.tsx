const Dashboard = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-semibold tracking-tight text-white mb-6">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-trading-dark p-6 rounded-lg border border-border/20">
          <h2 className="text-lg font-medium mb-4">Account Overview</h2>
          <p className="text-muted">Welcome to your trading dashboard!</p>
        </div>
        <div className="bg-trading-dark p-6 rounded-lg border border-border/20">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <p className="text-muted">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
