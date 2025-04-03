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
    <div className="min-h-screen flex flex-col bg-background">
      <div className="fixed top-0 left-0 right-0 z-10">
        <Header />
      </div>

      <div className="flex flex-1 pt-[64px]">
        <div className="fixed top-[64px] left-0 bottom-0 w-[250px] z-10">
          <Sidebar userInfo={userInfo} />
        </div>
        <main className="flex-1 ml-[250px] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
