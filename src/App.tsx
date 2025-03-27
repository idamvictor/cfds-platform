// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DepositLayout from "./layouts/DepositLayout";
import PersonalInformation from "./pages/PersonalInformation";
import CryptoDeposit from "./pages/deposit/CryptoDeposit";
import BankDeposit from "./pages/deposit/BankDeposit";
import CardDeposit from "./pages/deposit/CardDeposit";
import PaypalDeposit from "./pages/deposit/PaypalDeposit";
import OtherDeposit from "./pages/deposit/OtherDeposit";
import NotFound from "./pages/NotFound";
import TradingDashboard from "./pages/TradingDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <TooltipProvider> */}
    {/* <Toaster /> */}
    {/* <Sonner /> */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<TradingDashboard />} />
          <Route path="personal" element={<PersonalInformation />} />

          <Route path="deposit" element={<DepositLayout />}>
            <Route index element={<Navigate to="/deposit/crypto" replace />} />
            <Route path="crypto" element={<CryptoDeposit />} />
            <Route path="bank" element={<BankDeposit />} />
            <Route path="card" element={<CardDeposit />} />
            <Route path="paypal" element={<PaypalDeposit />} />
            <Route path="other" element={<OtherDeposit />} />

            {/* Extras */}
            <Route
              path="litecoin"
              element={
                <div className="p-6 bg-trading-dark rounded-lg border border-border/20">
                  <h1 className="text-xl font-medium">Litecoin</h1>
                  <p className="mt-2 text-muted-foreground">
                    Litecoin functionality coming soon.
                  </p>
                </div>
              }
            />
            <Route
              path="polyswarm"
              element={
                <div className="p-6 bg-trading-dark rounded-lg border border-border/20">
                  <h1 className="text-xl font-medium">polyswarm</h1>
                  <p className="mt-2 text-muted-foreground">
                    polyswarm functionality coming soon.
                  </p>
                </div>
              }
            />
            <Route
              path="dogecoin"
              element={
                <div className="p-6 bg-trading-dark rounded-lg border border-border/20">
                  <h1 className="text-xl font-medium">dogecoin</h1>
                  <p className="mt-2 text-muted-foreground">
                    dogecoin functionality coming soon.
                  </p>
                </div>
              }
            />
            <Route
              path="binance"
              element={
                <div className="p-6 bg-trading-dark rounded-lg border border-border/20">
                  <h1 className="text-xl font-medium">binance</h1>
                  <p className="mt-2 text-muted-foreground">
                    binance functionality coming soon.
                  </p>
                </div>
              }
            />
            <Route
              path="ethereum"
              element={
                <div className="p-6 bg-trading-dark rounded-lg border border-border/20">
                  <h1 className="text-xl font-medium">ethereum</h1>
                  <p className="mt-2 text-muted-foreground">
                    ethereum functionality coming soon.
                  </p>
                </div>
              }
            />
            <Route
              path="erc20"
              element={
                <div className="p-6 bg-trading-dark rounded-lg border border-border/20">
                  <h1 className="text-xl font-medium">erc20</h1>
                  <p className="mt-2 text-muted-foreground">
                    erc20 functionality coming soon.
                  </p>
                </div>
              }
            />
            <Route
              path="trc20"
              element={
                <div className="p-6 bg-trading-dark rounded-lg border border-border/20">
                  <h1 className="text-xl font-medium">trc20</h1>
                  <p className="mt-2 text-muted-foreground">
                    trc20 functionality coming soon.
                  </p>
                </div>
              }
            />
          </Route>

          {/* Placeholder routes for other sections */}
          <Route
            path="withdrawal"
            element={
              <div className="p-6 bg-trading-dark rounded-lg border border-border/20">
                <h1 className="text-xl font-medium">Withdrawal</h1>
                <p className="mt-2 text-muted-foreground">
                  Withdrawal functionality coming soon.
                </p>
              </div>
            }
          />
          <Route
            path="verification"
            element={
              <div className="p-6 bg-trading-dark rounded-lg border border-border/20">
                <h1 className="text-xl font-medium">Verification</h1>
                <p className="mt-2 text-muted-foreground">
                  Verification functionality coming soon.
                </p>
              </div>
            }
          />
          <Route
            path="accounts"
            element={
              <div className="p-6 bg-trading-dark rounded-lg border border-border/20">
                <h1 className="text-xl font-medium">Accounts</h1>
                <p className="mt-2 text-muted-foreground">
                  Accounts functionality coming soon.
                </p>
              </div>
            }
          />
          <Route
            path="chat"
            element={
              <div className="p-6 bg-trading-dark rounded-lg border border-border/20">
                <h1 className="text-xl font-medium">Live Chat</h1>
                <p className="mt-2 text-muted-foreground">
                  Chat functionality coming soon.
                </p>
              </div>
            }
          />
          <Route
            path="savings"
            element={
              <div className="p-6 bg-trading-dark rounded-lg border border-border/20">
                <h1 className="text-xl font-medium">Savings</h1>
                <p className="mt-2 text-muted-foreground">
                  Savings functionality coming soon.
                </p>
              </div>
            }
          />
          <Route
            path="settings"
            element={
              <div className="p-6 bg-trading-dark rounded-lg border border-border/20">
                <h1 className="text-xl font-medium">Settings</h1>
                <p className="mt-2 text-muted-foreground">
                  Settings functionality coming soon.
                </p>
              </div>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    {/* </TooltipProvider> */}
  </QueryClientProvider>
);

export default App;
