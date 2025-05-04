
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
      {/* Logo Header Section */}
      <div className="flex justify-center pt-12 pb-6">
        <div className="flex items-center">
          <ShoppingBag size={36} className="text-primary mr-2" />
          <h1 className="text-3xl font-bold">shopy</h1>
        </div>
      </div>
      
      {/* Main Content Section */}
      <div className="flex-grow flex flex-col items-center justify-center px-6">
        {/* Illustration */}
        <div className="w-full max-w-[280px] mb-12">
          <img 
            src="/lovable-uploads/2e884567-b327-4b68-a546-aea4e962d6ed.png" 
            alt="Store illustration" 
            className="w-full h-auto"
          />
        </div>
        
        {/* Call to Action Text */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          Try Shopy for free
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-md">
          The commerce platform trusted by millions of businesses worldwide
        </p>
        
        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-4 px-4">
          <Button 
            className="w-full py-6 rounded-md text-lg font-medium bg-[#222222] hover:bg-black"
            onClick={() => navigate('/signup')}
          >
            Get started
          </Button>
          
          <Button 
            variant="outline"
            className="w-full py-6 rounded-md text-lg font-medium border-gray-200"
            onClick={() => navigate('/login')}
          >
            Log in
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <div className="py-6 px-4 flex justify-between items-center border-t border-gray-100 mt-10">
        <div className="flex items-center">
          <ShoppingBag size={24} className="text-primary mr-1" />
          <span className="font-medium">Shopy</span>
        </div>
        <div className="text-sm text-gray-500">
          © 2025
        </div>
      </div>
    </div>
  );
};

export default Index;
