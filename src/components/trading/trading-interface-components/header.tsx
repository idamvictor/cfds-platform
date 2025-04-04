import type React from "react";

import { useRef } from "react";
import {
  Plus,
  Wallet,
  BotIcon as Robot,
  ChevronDown,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import TickerTape from "../ticker-tape";

interface HeaderProps {
  activePairs: string[];
  activePair: string;
  setActivePair: (pair: string) => void;
  removeCurrencyPair: (pair: string) => void;
}

export default function Header({
  activePairs,
  activePair,
  setActivePair,
  removeCurrencyPair,
}: HeaderProps) {
  const tabsListRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsListRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      tabsListRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const showScrollButtons = activePairs.length > 3;

  return (
    <>
      <header className="flex items-center justify-between h-16 px-4 border-b border-border bg-background">
        <div className="flex items-center">
          <div className="mr-6">
            <Logo />
          </div>
          <div className="flex items-center">
            {showScrollButtons && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => scrollTabs("left")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="overflow-hidden max-w-[500px]">
              <Tabs
                value={activePair}
                onValueChange={setActivePair}
                className="mr-2"
              >
                <TabsList
                  ref={tabsListRef}
                  className="bg-muted/50 overflow-x-auto flex-nowrap whitespace-nowrap scrollbar-hide"
                  style={{ scrollbarWidth: "none" }}
                >
                  {activePairs.map((pair) => (
                    <TabsTrigger
                      key={pair}
                      value={pair}
                      className="flex items-center gap-2 data-[state=active]:bg-primary/10"
                    >
                      <CurrencyFlag pair={pair} />
                      <span>{pair}</span>
                      <span className="text-xs text-muted-foreground">
                        forex
                      </span>
                      <button
                        className="ml-2 rounded-full hover:bg-muted p-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCurrencyPair(pair);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            {showScrollButtons && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => scrollTabs("right")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="icon" className="rounded-md ml-2">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 text-green-500 border-green-500/20 hover:bg-green-500/10"
          >
            <Robot className="h-4 w-4" />
            <span>Auto Trader</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2 text-green-500 border-green-500/20 hover:bg-green-500/10"
          >
            <Wallet className="h-4 w-4" />
            <span>Deposit</span>
          </Button>
          <div className="flex items-center ml-4">
            <div className="mr-2">
              <div className="text-xs text-muted-foreground">
                STANDARD ACCOUNT
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-green-500 font-bold"
                  >
                    $610.05 <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Account Details</DropdownMenuItem>
                  <DropdownMenuItem>Transaction History</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Avatar className="h-8 w-8 border border-border">
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" className="ml-1">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

    </>
  );
}

function Logo() {
  return (
    <div className="flex items-center">
      <div className="h-8 w-8 bg-green-500 rounded-md flex items-center justify-center mr-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-background"
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
          <polyline points="16 7 22 7 22 13"></polyline>
        </svg>
      </div>
      <span className="text-xl font-bold">Capital</span>
    </div>
  );
}

function CurrencyFlag({ pair }: { pair: string }) {
  // This would be replaced with actual flag images in a real implementation
  const firstCurrency = pair.split("/")[0];
  const color =
    firstCurrency === "AUD"
      ? "bg-blue-500"
      : firstCurrency === "EUR"
      ? "bg-yellow-500"
      : firstCurrency === "USD"
      ? "bg-green-500"
      : firstCurrency === "GBP"
      ? "bg-purple-500"
      : "bg-red-500";

  return (
    <div
      className={`h-5 w-5 rounded-full ${color} flex items-center justify-center text-xs text-white`}
    >
      {firstCurrency.charAt(0)}
    </div>
  );
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
