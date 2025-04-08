import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  server: {
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: true,
    },
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://server:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
    host: '0.0.0.0',
  },
});
