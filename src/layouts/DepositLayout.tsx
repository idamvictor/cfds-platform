import DepositHistory from "@/components/deposit-history";
import DepositPage from "@/pages/DepositPage.tsx";

const DepositLayout = () => {
  return (
    <>
      <DepositPage />
      <DepositHistory />
    </>
  );
};

export default DepositLayout;
