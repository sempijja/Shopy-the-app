
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StoreSetup from "./pages/StoreSetup";
import AddProduct from "./pages/AddProduct";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { supabase, verifySBConnection } from "./lib/supabase";

const App: React.FC = () => {
  useEffect(() => {
    // Check Supabase connection on app start
    if (import.meta.env.DEV) {
      verifySBConnection();
      
      // Log auth state for debugging
      const checkAuth = async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          console.log("Auth status:", data?.session ? "Authenticated" : "Not authenticated");
        } catch (err) {
          console.error("Auth check failed:", err);
        }
      };
      
      checkAuth();
    }
  }, []);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/store-setup" element={<StoreSetup />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
};

export default App;
