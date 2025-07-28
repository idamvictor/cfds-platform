"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, X, Play } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import useOverlayStore from "@/store/overlayStore";
import useDataStore from "@/store/dataStore";
import useUserStore from "@/store/userStore";
import { toast } from "sonner";
// import { cn } from "@/lib/utils";
import useSiteSettingsStore from "@/store/siteSettingStore";

type SectionState = {
  account: boolean;
  expertAdvisors: boolean;
  advisors: boolean;
};

export default function AlgoTrader() {
  const [expandedSections, setExpandedSections] = useState<SectionState>({
    account: true,
    expertAdvisors: true,
    advisors: true,
  });
  const { setAutomatedTrading } = useOverlayStore();
  const { data } = useDataStore();
  const user = useUserStore((state) => state.user);
  const settings = useSiteSettingsStore((state) => state.settings);

  const toggleSection = (section: keyof SectionState) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAdvisorClick = (advisorId: string) => {
    // Check if the advisor is available in the user's plan
    if (!user?.eas?.includes(advisorId)) {
      toast.error(
        "This Expert Advisor is not available for your plan. Please upgrade to access it."
      );
      return;
    }

    // Start the automated trading with the selected advisor
    setAutomatedTrading(true, advisorId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Algo Trader Header */}
      <div className="p-2 border-b border-slate-700 bg-slate-700 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Algo Trader</span>
          <div className="flex items-center gap-2">
            <Switch />
            <X className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 min-h-0 p-0 bg-[#1C2030]">
        <Card className="h-full bg-[#1C2030] border-slate-600 p-1 rounded-none shadow-none">
          <CardContent className="p-1 h-full">
            <div className="h-full overflow-auto space-y-1">
              {/* FTMO MT4 */}
              <div className="flex items-center gap-2 py-1 px-2 text-xs">
                {/* <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-white">$</span>
                </div> */}
                {/* <span>FTMO MT4</span> */}
                {/* <Logo /> */}
                <img
                  src={settings?.logo_sm || settings?.logo}
                  alt="Logo"
                  className=" w-auto h-8 rounded"
                />
              </div>

              {/* Account Section */}
              {/* <div>
                <button
                  onClick={() => toggleSection("account")}
                  className="flex items-center gap-1 py-1 px-2 text-xs w-full hover:bg-[#4a5a6c] rounded"
                >
                  {expandedSections.account ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                  <div className="w-4 h-4 bg-gray-600 rounded-sm flex items-center justify-center">
                    <span className="text-xs text-white">📁</span>
                  </div>
                  <span>Account</span>
                </button>

                {expandedSections.account && (
                  <div className="ml-6 space-y-1">
                    <div className="flex items-center gap-2 py-1 px-2 text-xs">
                      <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                        <span className="text-xs font-bold text-white">IC</span>
                      </div>
                      <span>ICMarkrtsSC-Demo</span>
                    </div>
                    <div className="flex items-center gap-2 py-1 px-2 text-xs">
                      <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                        <span className="text-xs font-bold text-white">IC</span>
                      </div>
                      <span>ICMarkrtsSC-Demo</span>
                    </div>
                  </div>
                )}
              </div> */}

              {/* Expert Advisors Section */}
              {/* <div>
                <button
                  onClick={() => toggleSection("expertAdvisors")}
                  className="flex items-center gap-1 py-1 px-2 text-xs w-full hover:bg-[#4a5a6c] rounded"
                >
                  {expandedSections.expertAdvisors ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                  <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                    <span className="text-xs text-white">EA</span>
                  </div>
                  <span>Expert Advisors</span>
                </button>

                {expandedSections.expertAdvisors && (
                  <div className="ml-6 space-y-1">
                    <div>
                      <button
                        onClick={() => toggleSection("advisors")}
                        className="flex items-center gap-1 py-1 px-2 text-xs w-full hover:bg-[#4a5a6c] rounded"
                      >
                        {expandedSections.advisors ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                        <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                          <span className="text-xs text-white">A</span>
                        </div>
                        <span>Advisors</span>
                      </button>

                      {expandedSections.advisors && data?.expert_advisors && (
                        <div className="ml-6 space-y-1">
                          {data.expert_advisors.map((advisor) => (
                            <button
                              key={advisor.id}
                              onClick={() => handleAdvisorClick(advisor.id)}
                              className={cn(
                                "flex items-center w-full gap-2 py-1 px-2 text-xs hover:bg-[#4a5a6c] rounded",
                                !user?.eas?.includes(advisor.id) &&
                                  "opacity-50 cursor-not-allowed"
                              )}
                              disabled={!user?.eas?.includes(advisor.id)}
                            >
                              <Play className="w-3 h-3" />
                              <span>{advisor.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div> */}

              {/* newone  */}
              {/* Advisors Section */}
              <div>
                <button
                  onClick={() => toggleSection("advisors")}
                  className="flex items-center gap-1 py-1 px-2 text-xs w-full hover:bg-[#4a5a6c] rounded"
                >
                  {expandedSections.advisors ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                  <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                    <span className="text-xs text-white">EA</span>
                  </div>
                  <span>Expert Advisors</span>
                </button>

                {expandedSections.advisors && data?.expert_advisors && (
                  <div className="ml-6 space-y-1">
                    {data.expert_advisors
                      .filter((advisor) => user?.eas?.includes(advisor.id))
                      .map((advisor) => (
                        <button
                          key={advisor.id}
                          onClick={() => handleAdvisorClick(advisor.id)}
                          className="flex items-center w-full gap-2 py-1 px-2 text-xs hover:bg-[#4a5a6c] rounded"
                        >
                          <Play className="w-3 h-3" />
                          <span>{advisor.name}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
