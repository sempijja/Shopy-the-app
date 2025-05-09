import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StoreSetup from "./pages/StoreSetup";
import AddProduct from "./pages/AddProduct";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import NewProduct from "@/pages/NewProduct";
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import OtpVerification from './pages/OtpVerification';
import { supabase } from "@/lib/supabase";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStore, setHasStore] = useState(false);
  const [hasProduct, setHasProduct] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  
  const getProtectedElement = (
    element: React.ReactNode,
    requireStore?: boolean,
    requireProduct?: boolean
  ) => {
    if (isLoading) return <LoadingSpinner />;
    if (!isAuthenticated) return <Navigate to="/" replace />;
    if (requireStore && !hasStore) return <Navigate to="/store-setup" replace />;
    if (requireProduct && !hasProduct) return <Navigate to="/add-product" replace />;
    return <>{element}</>;
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          await checkUserState(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setHasStore(false);
          setHasProduct(false);
        }
      }
    );

    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
          await checkUserState(sessionData.session.user.id);
        } else {
          setIsAuthenticated(false);
          setHasStore(false);
          setHasProduct(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const checkUserState = async (userId: string) => {
      setIsAuthenticated(true);
      // Check for store
      const { data: storeData } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!storeData) {
        setHasStore(false);
        setHasProduct(false);
        return;
      }
      setHasStore(true);

      // Check for at least one product
      const { data: productData } = await supabase
        .from('products')
        .select('id')
        .eq('user_id', userId);

      if (!productData || productData.length === 0) {
        setHasProduct(false);
        return;
      }
      setHasProduct(true);
    };

    checkSession();

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Global redirect logic
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      if (location.pathname !== "/login" && location.pathname !== "/signup") {
        navigate("/", { replace: true });
      }
      return;
    }
    if (!hasStore && location.pathname !== "/store-setup") {
      navigate("/store-setup", { replace: true });
      return;
    }
    if (hasStore && !hasProduct && location.pathname !== "/add-product") {
      navigate("/add-product", { replace: true });
      return;
    }
    if (hasStore && hasProduct && ["/store-setup", "/add-product", "/login", "/signup", "/"].includes(location.pathname)) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, hasStore, hasProduct, isLoading, location.pathname, navigate]);

  return (
    <>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/store-setup" element={getProtectedElement(<StoreSetup />, false, false)} />
          <Route path="/add-product" element={getProtectedElement(<AddProduct />, true, false)} />
          <Route path="/dashboard" element={getProtectedElement(<Dashboard />, true, true)} />
          <Route path="/products" element={getProtectedElement(<Products />, true, true)} />
          <Route path="/product-details" element={getProtectedElement(<ProductDetails />, true, true)} />
          <Route path="/new-product" element={getProtectedElement(<NewProduct />, true, false)} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
        </Routes>
      </TooltipProvider>
    </>
  );
};

export default App;