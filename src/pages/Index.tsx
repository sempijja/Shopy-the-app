
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '../lib/supabase';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if the user session exists before making unnecessary calls
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

  // Optimize loading state by avoiding unnecessary renders
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

  // Redirect user immediately if authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white px-6 py-10">
      {/* Main content */}
      <div className="space-y-12 mt-8">
        {/* Heading with highlighted text */}
        <h1 className="text-4xl font-bold leading-tight tracking-tighter">
          Turn <span className="text-primary">viewers</span> <br />into buyers.
        </h1>

        {/* Illustration */}
        <div className="flex justify-center py-6">
          <img 
            src="/lovable-uploads/938b7c19-16c3-4939-ae2f-1e90158b4092.png" 
            alt="Discount coupon illustration" 
            className="w-64 h-auto" 
          />
        </div>

        {/* Subtitle */}
        <p className="text-lg text-center font-medium">
          Set up your store and start taking<br />orders immediately
        </p>
      </div>

      {/* Action buttons */}
      <div className="space-y-4 mt-auto">
        <Button 
          className="w-full py-6 text-lg rounded-xl" 
          onClick={() => navigate('/login')}
        >
          Log in
        </Button>
        
        <div className="text-center">
          <button 
            className="text-primary font-medium text-lg"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </button>
        </div>

        {/* Bottom indicator bar */}
        <div className="flex justify-center mt-4">
          <div className="h-1 w-12 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
