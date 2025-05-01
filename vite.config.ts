
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path for GitHub Pages deployment
  base: mode === 'production' ? '/shopy-the-app/' : '/',
  server: {
    port: 8080,
    strictPort: true, // Fail if port is already in use
    host: true, // Listen on all IPv4 interfaces
    cors: true, // Enable CORS for all requests
  },
  preview: {
    port: 8080,
    strictPort: true,
    host: true,
    cors: true,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query'],
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}));
