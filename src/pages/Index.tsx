
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '../lib/supabase';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Initialize Cloudinary with error handling
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo', // Fallback to demo if env var is missing
    },
  });

  // Generate a responsive image URL with error handling
  const illustration = cld.image('Illustration_u3jd3p'); // Public ID
  illustration.resize(fill().width(400).height(400)); // Resize to 400x400 pixels for better quality

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-secondary/20 px-6 py-12">
      {/* Main container with better spacing */}
      <div className="flex flex-col h-full justify-between max-w-md mx-auto w-full">
        {/* Header Section with brand accent */}
        <div className="mb-8 items-center text-center">
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tighter">
            Turn <span className="text-primary bg-gradient-to-r from-primary to-shopy-600 bg-clip-text text-transparent">viewers</span> <br />
            into <span className="text-shopy-800">buyers.</span>
          </h1>
        </div>

        {/* Centered Illustration with animation and shadow */}
        <div className="flex justify-center items-center my-8 relative">
          <div className="absolute w-64 h-64 bg-primary/5 rounded-full filter blur-xl"></div>
          <img 
            src={illustration.toURL()} 
            alt="Discount coupon illustration" 
            className="w-64 md:w-80 h-auto relative drop-shadow-xl animate-fade-in"
            style={{ animation: 'fadeIn 1.2s ease-out' }}
          />
        </div>

        {/* Subtitle with brand styling */}
        <div className="mb-8 items-center text-center">
          <p className="text-xl font-medium text-gray-700">
            Set up your store and start taking<br />
            orders <span className="text-primary font-semibold">immediately</span>
          </p>
        </div>

        {/* Action Buttons with improved styling */}
        <div className="space-y-6 mt-6 mb-8">
          <Button 
            className="w-full py-6 text-lg rounded-xl shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
            onClick={() => navigate('login')}
          >
            Log in
          </Button>
          
          <div className="text-center">
            <button 
              className="text-primary font-medium text-lg transition-all hover:text-shopy-700 hover:underline"
              onClick={() => navigate('signup')}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
