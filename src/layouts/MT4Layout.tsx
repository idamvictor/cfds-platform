import Header from "@/components/mt4/header";
import Sidebar from "@/components/mt4/sidebar";
import TotalPortfolio from "@/components/mt4/total-portfolio";
import { Outlet } from "react-router-dom";

const MT4Layout = () =>{
    return (
      <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
        {/* Header - Full width at top */}
        <Header />

        {/* Main Layout Container */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Left navigation */}
          <Sidebar />

          {/* Main Content - Chart, Right Panels, Position Display */}
          <Outlet/>
        </div>

        {/* Total Portfolio - Full width at bottom, independent of other components */}
        <TotalPortfolio />
      </div>
    );

}

export default MT4Layout;

