
import React, { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StoreSetup from "./pages/StoreSetup";
import AddProduct from "./pages/AddProduct";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

// Function to verify Supabase connection in dev mode
const verifySBConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("_dummy_query")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Supabase connection error:", error);
      return false;
    }

    console.log("Supabase connection verified successfully");
    return true;
  } catch (err) {
    console.error("Supabase connection error:", {
      message: err instanceof Error ? err.message : "Unknown error",
      details: err instanceof Error ? err.stack : String(err),
      hint: "",
      code: ""
    });
    return false;
  }
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check Supabase connection on app start
    if (import.meta.env.DEV) {
      verifySBConnection();
    }
    
    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);
        
        if (event === "SIGNED_IN" && session) {
          setIsAuthenticated(true);
          
          // Check if user has a store
          try {
            const { data: storeData } = await supabase
              .from("stores")
              .select("id")
              .eq("user_id", session.user.id)
              .maybeSingle();
              
            setHasStore(!!storeData);
          } catch (error) {
            console.error("Error checking store:", error);
            setHasStore(false);
          }
          
          toast({
            title: "Signed in",
            description: "You have successfully signed in.",
          });
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setHasStore(null);
          
          toast({
            title: "Signed out",
            description: "You have been signed out.",
          });
        }
      }
    );
    
    // Check initial session
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data?.session) {
          setIsAuthenticated(true);
          
          const { data: storeData } = await supabase
            .from("stores")
            .select("id")
            .eq("user_id", data.session.user.id)
            .maybeSingle();
            
          setHasStore(!!storeData);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      );
    }
    
    if (isAuthenticated === false) {
      return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
  };

  // Store setup required route
  const StoreRequiredRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      );
    }
    
    if (isAuthenticated === false) {
      return <Navigate to="/login" replace />;
    }
    
    if (hasStore === false) {
      return <Navigate to="/store-setup" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/store-setup" element={
            <ProtectedRoute>
              <StoreSetup />
            </ProtectedRoute>
          } />
          <Route path="/add-product" element={
            <StoreRequiredRoute>
              <AddProduct />
            </StoreRequiredRoute>
          } />
          <Route path="/dashboard" element={
            <StoreRequiredRoute>
              <Dashboard />
            </StoreRequiredRoute>
          } />
          <Route path="/products" element={
            <StoreRequiredRoute>
              <Products />
            </StoreRequiredRoute>
          } />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </>
  );
};

export default App;
