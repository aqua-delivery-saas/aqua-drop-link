import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginDistributor from "./pages/distributor/LoginDistributor";
import SignupDistributor from "./pages/distributor/SignupDistributor";
import Dashboard from "./pages/distributor/Dashboard";
import Products from "./pages/distributor/Products";
import Settings from "./pages/distributor/Settings";
import Orders from "./pages/distributor/Orders";
import OrderPage from "./pages/customer/OrderPage";
import OrderConfirmation from "./pages/customer/OrderConfirmation";
import SignupCustomer from "./pages/customer/SignupCustomer";
import OrderHistory from "./pages/customer/OrderHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Distributor Routes */}
          <Route path="/distributor/login" element={<LoginDistributor />} />
          <Route path="/distributor/signup" element={<SignupDistributor />} />
          <Route path="/distributor/dashboard" element={<Dashboard />} />
          <Route path="/distributor/products" element={<Products />} />
          <Route path="/distributor/settings" element={<Settings />} />
          <Route path="/distributor/orders" element={<Orders />} />
          
          {/* Customer Routes */}
          <Route path="/order/:distributorSlug" element={<OrderPage />} />
          <Route path="/order/confirmation" element={<OrderConfirmation />} />
          <Route path="/customer/signup" element={<SignupCustomer />} />
          <Route path="/customer/history" element={<OrderHistory />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
