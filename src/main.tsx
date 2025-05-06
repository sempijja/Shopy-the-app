import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Make sure we have the root element
const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')
const root = createRoot(container)

console.log("App is starting...");

// Determine the correct base URL for the environment
const isDevelopment = import.meta.env.MODE === 'development';
const basePath = isDevelopment ? '' : '/Shopy-the-app';

console.log("Base path:", basePath);

// Register service worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const swPath = `${basePath}/serviceWorker.js`;
    console.log(`Registering service worker at path: ${swPath}`);
    
    navigator.serviceWorker.register(swPath)
      .then(registration => {
        console.log('Service Worker registered: ', registration);
        
        // Check if there's an update and notify user
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New content is available; please refresh.');
              }
            });
          }
        });
      })
      .catch(registrationError => {
        console.error('Service Worker registration failed: ', registrationError);
      });
  });
}

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter basename={import.meta.env.MODE === "production" ? "/Shopy-the-app" : "/"}>
    <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
