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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Welcome to Shopy</h1>
          <p className="text-xl text-gray-600 mb-8">Your personal e-commerce solution</p>
        </div>
        
        <div className="space-y-4">
          <Button className="w-full py-6 text-lg" onClick={() => navigate('/login')}>
            Log In
          </Button>
          <Button variant="outline" className="w-full py-6 text-lg" onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
