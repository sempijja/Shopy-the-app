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

  // Initialize Cloudinary
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud name
    },
  });

  // Generate a responsive image URL
  const illustration = cld.image('Illustration_u3jd3p'); // Public ID
  illustration.resize(fill().width(256).height(256)); // Resize to 256x256 pixels

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
    <div className="min-h-screen flex flex-col justify-between bg-white px-6 py-10 lg:px-20 lg:py-16">
      {/* Header Section */}
      <div className="text-center lg:text-left">
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tighter">
          Turn <span className="text-primary">viewers</span> <br />into buyers.
        </h1>
      </div>

      {/* Illustration Section */}
      <div className="flex justify-center items-center">
        <img 
          src={illustration.toURL()} 
          alt="Discount coupon illustration" 
          className="w-64 lg:w-96 h-auto" 
        />
      </div>

      {/* Subtitle Section */}
      <div className="text-center lg:text-left">
        <p className="text-lg lg:text-xl font-medium">
          Set up your store and start taking<br />orders immediately
        </p>
      </div>

      {/* Action Buttons Section */}
      <div className="space-y-4 mt-auto">
        <Button 
          className="w-full lg:w-auto py-6 text-lg rounded-xl" 
          onClick={() => navigate('/login')}
        >
          Log in
        </Button>
        
        <div className="text-center lg:text-left">
          <button 
            className="text-primary font-medium text-lg"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;