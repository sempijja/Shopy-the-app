
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App.tsx'
import './index.css'

// Initialize React Query client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      onError: (error) => {
        console.error("Query error:", error);
      }
    },
  },
});

// Check environment variables early
const checkEnvVariables = () => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missingVars = requiredVars.filter(key => !import.meta.env[key]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
  }
};

// Run environment check
checkEnvVariables();

// Get the root element and create React root
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

console.log("App is starting...", {
  mode: import.meta.env.MODE,
  base: import.meta.env.BASE_URL
});

// Register service worker in production only
if (import.meta.env.PROD) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${import.meta.env.BASE_URL}serviceWorker.js`;
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('Service Worker registered: ', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed: ', error);
        });
    });
  }
}

// Render the app
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
