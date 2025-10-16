import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginDistributor from "./pages/distributor/LoginDistributor";
import SignupDistributor from "./pages/distributor/SignupDistributor";
import Dashboard from "./pages/distributor/Dashboard";
import Products from "./pages/distributor/Products";
import Settings from "./pages/distributor/Settings";
import Orders from "./pages/distributor/Orders";
import Profile from "./pages/distributor/Profile";
import SeoSettings from "./pages/distributor/SeoSettings";
import BusinessHours from "./pages/distributor/BusinessHours";
import DiscountSettings from "./pages/distributor/DiscountSettings";
import LoyaltyProgram from "./pages/distributor/LoyaltyProgram";
import OrderPage from "./pages/customer/OrderPage";
import OrderConfirmation from "./pages/customer/OrderConfirmation";
import SignupCustomer from "./pages/customer/SignupCustomer";
import OrderHistory from "./pages/customer/OrderHistory";
import CityDistributors from "./pages/customer/CityDistributors";
import { DistributorLayout } from "./layouts/DistributorLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Distributor Routes */}
            <Route path="/distributor/login" element={<LoginDistributor />} />
            <Route path="/distributor/signup" element={<SignupDistributor />} />
            <Route path="/distributor/dashboard" element={<DistributorLayout><Dashboard /></DistributorLayout>} />
            <Route path="/distributor/products" element={<DistributorLayout><Products /></DistributorLayout>} />
            <Route path="/distributor/settings" element={<DistributorLayout><Settings /></DistributorLayout>} />
            <Route path="/distributor/settings/seo" element={<DistributorLayout><SeoSettings /></DistributorLayout>} />
            <Route path="/distributor/settings/business-hours" element={<DistributorLayout><BusinessHours /></DistributorLayout>} />
            <Route path="/distributor/settings/discounts" element={<DistributorLayout><DiscountSettings /></DistributorLayout>} />
            <Route path="/distributor/settings/loyalty" element={<DistributorLayout><LoyaltyProgram /></DistributorLayout>} />
            <Route path="/distributor/orders" element={<DistributorLayout><Orders /></DistributorLayout>} />
            <Route path="/distributor/profile" element={<DistributorLayout><Profile /></DistributorLayout>} />
            
            {/* Customer Routes */}
            <Route path="/distribuidoras/:citySlug" element={<CityDistributors />} />
            <Route path="/order/:distributorSlug" element={<OrderPage />} />
            <Route path="/order/confirmation" element={<OrderConfirmation />} />
            <Route path="/customer/signup" element={<SignupCustomer />} />
            <Route path="/customer/history" element={<OrderHistory />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
