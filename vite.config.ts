import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: "/", // Base path - raiz do domínio
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
          },
        },
      },
    },
    server: {
      historyApiFallback: true,
    },
    // Define variáveis de ambiente globais
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV || 'development'),
    },
  };
});
