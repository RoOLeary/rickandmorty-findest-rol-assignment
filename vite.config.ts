import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress specific deprecation warnings (like legacy JS API warnings)
        if (warning.message.includes('deprecated legacy JS API')) {
          return;
        }
        // Default behavior: pass through any other warnings
        warn(warning);
      }
    }
  },
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
});
