import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const MainLayout = () => {
  const userInfo = {
    name: "Jawad Ali",
    id: "2076514",
    email: "jeehan.4j@outlook.com",
  };

  return (
    <div className="min-h-screen flex flex-col bg-trading-darker">
      <Header />

      <div className="flex flex-1">
        <Sidebar userInfo={userInfo} />

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
