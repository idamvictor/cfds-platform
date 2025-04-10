import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

const Test = lazy(() => import("./pages/test"));
const Trading = lazy(() => import("./pages/trading"));
const RegisterPage = lazy(() => import("./pages/auth/register-page"));
const LoginPage = lazy(() => import("./pages/auth/login-page"));
const ForgotPasswordPage = lazy(
  () => import("./pages/auth/forgot-password-page")
);
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const DepositLayout = lazy(() => import("./layouts/DepositLayout"));
const PersonalInformation = lazy(
  () => import("./pages/Preferences/PersonalInformation")
);
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
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/main/dashboard" replace />} />
            <Route path="/main/dashboard" element={<TradingDashboard />} />
            <Route path="/main/personal" element={<PersonalInformation />} />

            <Route path="/main/deposit" element={<DepositLayout />}>
              <Route
                index
                element={<Navigate to="/main/deposit/crypto" replace />}
              />
              <Route
                path="/main/deposit/crypto"
                element={
                  <QRCodeDeposit
                    address="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                    title="Bitcoin Deposit"
                    qrTitle="BTC QR CODE"
                    addressTitle="BTC ADDRESS"
                  />
                }
              />
              <Route path="/main/deposit/bank" element={<BankDeposit />} />
              <Route path="/main/deposit/card" element={<CardDeposit />} />
              <Route path="/main/deposit/paypal" element={<PaypalDeposit />} />
              <Route path="/main/deposit/other" element={<OtherDeposit />} />

              {/* Extras */}
              <Route
                path="/main/deposit/litecoin"
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
                path="/main/deposit/polyswarm"
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
                path="/main/deposit/dogecoin"
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
                path="/main/deposit/binance"
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
                path="/main/deposit/ethereum"
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
                path="/main/deposit/erc20"
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
                path="/main/deposit/trc20"
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
            <Route path="/main/withdrawal" element={<WithdrawalForm />} />
            <Route path="/main/verification" element={<Verification />} />
            <Route path="/main/accounts" element={<AccountsPage />} />
            <Route path="/main/chat" element={<LiveChat />} />
            <Route path="/main/savings" element={<SavingsPage />} />
            <Route path="/main/settings" element={<SettingsPage />} />
            <Route path="/main/test" element={<Test />} />
          </Route>
          <Route
            path="trading"
            element={
              <ProtectedRoute>
                <Trading />
              </ProtectedRoute>
            }
          />

          {/* Authentication Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </QueryClientProvider>
);

export default App;
