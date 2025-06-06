"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronRight, Folder, FileText, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AutomatedTrading from "./automated-trading";

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
  const [showAutomatedTrading, setShowAutomatedTrading] = useState(false);

  const toggleSection = (section: keyof SectionState) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Algo Trader Header - Fixed Position */}
      <div className="p-2 border-b border-slate-700 bg-slate-700 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Algo Trader</span>
          <div className="flex items-center gap-2">
            <Switch />
            <X className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Navigation Tree - Fixed Height Container */}
      <div className="flex-1 min-h-0 p-0 bg-[#1C2030]">
        <Card className="h-full bg-[#1C2030] border-slate-600 p-1 rounded-none shadow-none">
          <CardContent className="p-1 h-full">
            <div className="h-full overflow-auto space-y-1">
              {/* FTMO MT4 */}
              <div className="flex items-center gap-2 py-1 px-2 text-xs">
                <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-white">$</span>
                </div>
                <span>FTMO MT4</span>
              </div>

              {/* Account Section */}
              <div>
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
              </div>

              {/* Expert Advisors Section */}
              <div>
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
                    {/* Advisors Subfolder */}
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
                        <div className="w-4 h-4 bg-yellow-500 rounded-sm flex items-center justify-center">
                          <Folder className="w-2 h-2 text-white" />
                        </div>
                        <span>Advisors</span>
                      </button>

                      {expandedSections.advisors && (
                        <div className="ml-6 space-y-1">
                          <button
                            onClick={() => setShowAutomatedTrading(true)}
                            className="w-full flex items-center gap-2 py-1 px-2 text-xs hover:bg-[#4a5a6c] rounded"
                          >
                            <div className="w-4 h-4 bg-blue-400 rounded-sm flex items-center justify-center">
                              <FileText className="w-2 h-2 text-white" />
                            </div>
                            <span>ExpertMACD</span>
                          </button>
                          <div className="flex items-center gap-2 py-1 px-2 text-xs">
                            <div className="w-4 h-4 bg-blue-400 rounded-sm flex items-center justify-center">
                              <FileText className="w-2 h-2 text-white" />
                            </div>
                            <span>ExpertMAMA</span>
                          </div>
                          <div className="flex items-center gap-2 py-1 px-2 text-xs">
                            <div className="w-4 h-4 bg-blue-400 rounded-sm flex items-center justify-center">
                              <FileText className="w-2 h-2 text-white" />
                            </div>
                            <span>ExpertMAPSAR</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automated Trading Modal */}
      {showAutomatedTrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative">
            {/* <button
              onClick={() => setShowAutomatedTrading(false)}
              className="absolute -top-2 -right-2 z-10"
            >
              <X className="h-4 w-4" />
            </button> */}
            <AutomatedTrading onClose={() => setShowAutomatedTrading(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
