import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      // Alias for crypto and stream modules for browser compatibility
      crypto: "crypto-browserify",
      stream: "stream-browserify",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true, // Enable Buffer polyfill
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
});
