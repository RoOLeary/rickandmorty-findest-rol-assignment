import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress specific deprecation warnings
        if (warning.message.includes("Sass @import rules are deprecated")) {
          return;
        }
        // Default behavior: pass through any other warnings
        warn(warning);
      },
    },
  },

  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
});
