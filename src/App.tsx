import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionGuard } from "@/components/auth/SubscriptionGuard";
import LandingPage from "./pages/LandingPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { SignupCheckoutPage } from "./pages/SignupCheckoutPage";
import { SuccessPage } from "./pages/SuccessPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import ConfigurationPage from "./pages/ConfigurationPage";
import PatientsPage from "./pages/PatientsPage";
import PatientDetailPage from "./pages/PatientDetailPage";
import AnnotationsPage from "./pages/AnnotationsPage";
import CreateAnnotationPage from "./pages/CreateAnnotationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/signup" element={<SignupCheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
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
              <Route path="patients" element={<PatientsPage />} />
              <Route path="patients/:patientId" element={<PatientDetailPage />} />
              <Route path="annotations" element={<AnnotationsPage />} />
              <Route path="annotations/new" element={<CreateAnnotationPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
