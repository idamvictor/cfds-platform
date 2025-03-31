import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Test from "./pages/test";
import Trading from "./pages/trading";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const DepositLayout = lazy(() => import("./layouts/DepositLayout"));
const PersonalInformation = lazy(
  () => import("./pages/Preferences/PersonalInformation")
);
const CryptoDeposit = lazy(() => import("./pages/deposit/CryptoDeposit"));
const BankDeposit = lazy(() => import("./pages/deposit/BankDeposit"));
const CardDeposit = lazy(() => import("./pages/deposit/CardDeposit"));
const PaypalDeposit = lazy(() => import("./pages/deposit/PaypalDeposit"));
const OtherDeposit = lazy(() => import("./pages/deposit/OtherDeposit"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TradingDashboard = lazy(
  () => import("./pages/Preferences/TradingDashboard")
);
const WithdrawalForm = lazy(
  () => import("./pages/Preferences/withdrawal-form")
);
const Verification = lazy(() => import("./pages/Preferences/verification"));
const AccountsPage = lazy(() => import("./pages/Preferences/accounts-page"));
const LiveChat = lazy(() => import("./pages/Preferences/live-chat"));
const SettingsPage = lazy(() => import("./pages/Preferences/settings-page"));
const SavingsPage = lazy(() => import("./pages/Preferences/savings-page"));
const QRCodeDeposit = lazy(() => import("./pages/deposit/qr-code-deposit"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<TradingDashboard />} />
            <Route path="personal" element={<PersonalInformation />} />

            <Route path="deposit" element={<DepositLayout />}>
              <Route
                index
                element={<Navigate to="/deposit/crypto" replace />}
              />
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
            <Route path="test" element={<Test />} />
          </Route>
          <Route path="trading" element={<Trading />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </QueryClientProvider>
);

export default App;
