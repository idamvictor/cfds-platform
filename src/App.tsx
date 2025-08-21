import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { BaseLayout } from "@/components/BaseLayout.tsx";
import { SiteProvider } from "@/components/provider/SiteProvider.tsx";
import LoadingScreen from "./components/loading-screen";
import WebSocketInitializer from "@/components/WebSocketInitializer.tsx";
import useSiteSettingsStore from "@/store/siteSettingStore";
import { OnlineStatusInitializer } from "@/components/OnlineStatusInitializer.tsx";
import AdminChat from "@/pages/admin/AdminChat.tsx";
import SignUpPage from "@/pages/auth/signup-page.tsx";
import CountryResidencePage from "@/pages/auth/country-page.tsx";
import { ChatNotificationListener } from "@/components/ChatNotificationListener.tsx";
import MT4Layout from "./layouts/MT4Layout";
import MainContent from "./components/mt4/main-content";
import MarketplacePage from "@/pages/marketplace/marketplace-page.tsx";
import TranslationErrorBoundary from "@/components/TranslationErrorBoundary.tsx";

const TradingRouter = lazy(() => import("./components/routing/TradingRouter"));

const AutoLoginPage = lazy(() => import("./pages/auth/auto-login"));

const Test = lazy(() => import("./pages/test"));
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
// const BankDeposit = lazy(() => import("./pages/deposit/BankDeposit"));
const CardDeposit = lazy(() => import("./pages/deposit/CardDeposit"));
// const PaypalDeposit = lazy(() => import("./pages/deposit/PaypalDeposit"));
// const OtherDeposit = lazy(() => import("./pages/deposit/OtherDeposit"));
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
const CryptoWalletDeposit = lazy(
  () => import("./pages/deposit/CryptoWalletDeposit")
);

const queryClient = new QueryClient();

const App = () => {
  const settings = useSiteSettingsStore((state) => state.settings);

  // Update favicon when settings change
  useEffect(() => {
    if (settings?.favicon) {
      const link =
        (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = settings.favicon;
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }, [settings?.favicon]);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingScreen />}>
        <Toaster position="top-right" />
        <BrowserRouter>
          <SiteProvider>
            <BaseLayout>
              <TranslationErrorBoundary>
                <WebSocketInitializer />
                <OnlineStatusInitializer />
                <ChatNotificationListener />
                <Routes>
                <Route
                  path="/admin/chat"
                  element={
                    <ProtectedRoute>
                      <AdminChat />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/main"
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route
                    index
                    element={<Navigate to="/main/dashboard" replace />}
                  />
                  <Route
                    path="/main/dashboard"
                    element={<TradingDashboard />}
                  />
                  <Route
                    path="/main/personal"
                    element={<PersonalInformation />}
                  />

                  <Route path="/main/deposit" element={<DepositLayout />}>
                    <Route
                      index
                      element={<Navigate to="/main/deposit/:crypto" replace />}
                    />
                    {/*<Route*/}
                    {/*  path="/main/deposit/bank"*/}
                    {/*  element={<BankDeposit />}*/}
                    {/*/>*/}
                    <Route
                      path="/main/deposit/card"
                      element={<CardDeposit />}
                    />

                    {/* <Route
                      path="/main/deposit/paypal"
                      element={<PaypalDeposit />}
                    />
                    <Route
                      path="/main/deposit/other"
                      element={<OtherDeposit />}
                    /> */}

                    {/* Crypto routes */}
                    <Route
                      path="/main/deposit/:crypto"
                      element={<CryptoWalletDeposit />}
                    />
                    <Route
                      path="/main/deposit/:crypto/:walletId"
                      element={<CryptoWalletDeposit />}
                    />
                  </Route>



                  <Route path="/main/marketplace" element={<MarketplacePage />} />


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
                        <TradingRouter />
                      </ProtectedRoute>
                    }
                />

                {/* Authentication Routes */}
                <Route path="/auto-login" element={<AutoLoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route
                  path="/register/country-residence"
                  element={<CountryResidencePage />}
                />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />

                <Route
                  path="/mt4"
                  element={
                    <ProtectedRoute>
                      <MT4Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<MainContent />} />
                </Route>

                <Route path="*" element={<NotFound />} />
                </Routes>
              </TranslationErrorBoundary>
            </BaseLayout>
          </SiteProvider>
        </BrowserRouter>
      </Suspense>
    </QueryClientProvider>
  );
};

export default App;
