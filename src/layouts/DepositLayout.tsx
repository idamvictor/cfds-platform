import DepositHistory from "@/components/deposit-history";
import DepositPage from "@/pages/DepositPage.tsx";
import { useState } from "react";

const DepositLayout = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDepositSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="px-6">
      <DepositPage onDepositSuccess={handleDepositSuccess} />
      <DepositHistory key={refreshTrigger} />
    </div>
  );
};

export default DepositLayout;
