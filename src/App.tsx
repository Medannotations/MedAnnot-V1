import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionGuard } from "@/components/auth/SubscriptionGuard";
import { ScrollToTop } from "@/components/ScrollToTop";
import LandingPage from "./pages/LandingPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { SignupCheckoutPage } from "./pages/SignupCheckoutPage";
import { SuccessPage } from "./pages/SuccessPage";
import { PendingPaymentPage } from "./pages/PendingPaymentPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import ConfigurationPage from "./pages/ConfigurationPage";
import SettingsPage from "./pages/SettingsPage";

import PatientsPage from "./pages/PatientsPage";
import PatientDetailPage from "./pages/PatientDetailPage";
import AnnotationsPage from "./pages/AnnotationsPage";
import CreateAnnotationPage from "./pages/CreateAnnotationPage";
import EditAnnotationPage from "./pages/EditAnnotationPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import TermsOfSalePage from "./pages/TermsOfSalePage";
import LegalNoticePage from "./pages/LegalNoticePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordConfirmPage from "./pages/ResetPasswordConfirmPage";
import AdminFixAnnotations from "./pages/AdminFixAnnotations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (anciennement cacheTime)
      retry: 1,
      refetchOnWindowFocus: false, // Évite les rechargements inutiles
      refetchOnMount: false, // Utilise les données en cache si disponibles
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/signup" element={<SignupCheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/pending-payment" element={<PendingPaymentPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordConfirmPage />} />

            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/terms-of-sale" element={<TermsOfSalePage />} />
            <Route path="/legal-notice" element={<LegalNoticePage />} />

            {/* Admin Route */}
            <Route
              path="/admin/fix-annotations"
              element={
                <SubscriptionGuard>
                  <AdminFixAnnotations />
                </SubscriptionGuard>
              }
            />

            <Route
              path="/app"
              element={
                <SubscriptionGuard>
                  <DashboardLayout />
                </SubscriptionGuard>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="configuration" element={<ConfigurationPage />} />
              <Route path="settings" element={<SettingsPage />} />

              <Route path="patients" element={<PatientsPage />} />
              <Route path="patients/:patientId" element={<PatientDetailPage />} />
              <Route path="annotations" element={<AnnotationsPage />} />
              <Route path="annotations/new" element={<CreateAnnotationPage />} />
              <Route path="annotations/:id/edit" element={<EditAnnotationPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
