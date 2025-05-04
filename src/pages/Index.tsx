
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '../lib/supabase';
import { ShoppingBag } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setUser(data.session.user);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Shopy...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-8 flex justify-center">
        <div className="flex items-center">
          <ShoppingBag size={40} className="text-primary mr-2" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-shopy-700">shopy</h1>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-10 max-w-5xl mx-auto">
        <div className="w-full max-w-md mx-auto mb-10">
          <img 
            src="/lovable-uploads/2e884567-b327-4b68-a546-aea4e962d6ed.png" 
            alt="Store illustration" 
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </div>
        
        <div className="text-center mb-12 w-full max-w-xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-shopy-500">
            Try Shopy for free
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto">
            The commerce platform trusted by millions of businesses worldwide
          </p>
        </div>
        
        <div className="w-full max-w-md space-y-5">
          <Button 
            className="w-full py-7 rounded-xl text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
            onClick={() => navigate('/signup')}
          >
            Get started
          </Button>
          
          <Button 
            variant="outline"
            className="w-full py-7 rounded-xl text-lg font-medium border-gray-200 hover:border-primary/30 hover:bg-secondary/50 transition-all duration-300"
            onClick={() => navigate('/login')}
          >
            Log in
          </Button>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-8 px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <ShoppingBag size={24} className="text-primary mr-2" />
            <span className="font-medium text-lg">Shopy</span>
          </div>
          <div className="text-sm text-gray-500">
            © 2025 Shopy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
