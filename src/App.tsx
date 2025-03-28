// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DepositLayout from "./layouts/DepositLayout";
import PersonalInformation from "./pages/Preferences/PersonalInformation";
import CryptoDeposit from "./pages/deposit/CryptoDeposit";
import BankDeposit from "./pages/deposit/BankDeposit";
import CardDeposit from "./pages/deposit/CardDeposit";
import PaypalDeposit from "./pages/deposit/PaypalDeposit";
import OtherDeposit from "./pages/deposit/OtherDeposit";
import NotFound from "./pages/NotFound";
import TradingDashboard from "./pages/Preferences/TradingDashboard";
import WithdrawalForm from "./pages/Preferences/withdrawal-form";
import Verification from "./pages/Preferences/verification";
import AccountsPage from "./pages/Preferences/accounts-page";
import LiveChat from "./pages/Preferences/live-chat";
import SettingsPage from "./pages/Preferences/settings-page";
import SavingsPage from "./pages/Preferences/savings-page";
import QRCodeDeposit from "./pages/deposit/qr-code-deposit";

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
                <QRCodeDeposit
                  address="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                  title="litecoin Deposit"
                  qrTitle="LTC QR CODE"
                  addressTitle="LTC ADDRESS"
                />
              }
            />
            <Route
              path="polyswarm"
              element={
                <QRCodeDeposit
                  address="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                  title="polyswarm Deposit"
                  qrTitle="polyswarm QR CODE"
                  addressTitle="polyswarm ADDRESS"
                />
              }
            />
            <Route
              path="dogecoin"
              element={
                <QRCodeDeposit
                  address="DJHXpkQGcRydAZ7KyXmkRNHdRvMVXwMYAE"
                  title="Dogecoin"
                  qrTitle="SCAN ME"
                  addressTitle="YOUR DOGE ADDRESS"
                />
              }
            />
            <Route
              path="binance"
              element={
                <QRCodeDeposit
                  address="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                  title="binance Deposit"
                  qrTitle="Binance QR CODE"
                  addressTitle="Binance ADDRESS"
                />
              }
            />
            <Route
              path="ethereum"
              element={
                <QRCodeDeposit
                  address="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                  title="Ethereum Deposit"
                  qrTitle="ETH QR CODE"
                  addressTitle="ETH ADDRESS"
                />
              }
            />
            <Route
              path="erc20"
              element={
                <QRCodeDeposit
                  address="DJHXpkQGcRydAZ7KyXmkRNHdRvMVXwMYAE"
                  title="ERC20"
                  qrTitle="SCAN ME"
                  addressTitle="YOUR ERC20 ADDRESS"
                />
              }
            />
            <Route
              path="trc20"
              element={
                <QRCodeDeposit
                  address="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                  title="TRC20 Deposit"
                  qrTitle="TRC20 QR CODE"
                  addressTitle="TRC20 ADDRESS"
                />
              }
            />
          </Route>

          {/* Placeholder routes for other sections */}
          <Route path="withdrawal" element={<WithdrawalForm />} />
          <Route path="verification" element={<Verification />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="chat" element={<LiveChat />} />
          <Route path="savings" element={<SavingsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    {/* </TooltipProvider> */}
  </QueryClientProvider>
);

export default App;
