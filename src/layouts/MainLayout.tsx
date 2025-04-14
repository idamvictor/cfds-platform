import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

const MainLayout = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleLinkClick = () => {
    setSidebarVisible(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="fixed top-0 left-0 right-0 z-20">
        <Header toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-1 pt-[90px]">
        <div
          className={`fixed top-[80px] left-0 bottom-0 w-[250px] z-10  transition-transform transform ${
            isSidebarVisible ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <Sidebar onLinkClick={handleLinkClick} />
        </div>
        <main className="flex-1 md:ml-[250px] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
