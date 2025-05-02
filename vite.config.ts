import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  // Base path for GitHub Pages deployment
  base: mode === "production" ? "/shopy-the-app/" : "/",
  server: {
    port: 8080,
    strictPort: true, // Fail if port is already in use
    host: true, // Listen on all IPv4 interfaces
    cors: true, // Enable CORS for all requests
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "favicons/*.png"],
      manifest: {
        name: "Shopy",
        short_name: "Shopy",
        description: "Your personal e-commerce solution",
        theme_color: "#8a3bc2",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "public/favicons/android-icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "public/favicons/apple-icon-180x180.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "public/favicons/favicon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/your-api-domain\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@tanstack/react-query"],
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
}));
