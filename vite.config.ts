import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/@xenova/transformers/dist/*.wasm',
            dest: '.',
          },
          {
            src: 'node_modules/onnxruntime-web/dist/*.wasm',
            dest: '.',
          }
        ],
      }),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Voice Cart',
          short_name: 'VoiceCart',
          theme_color: '#0d631b',
          icons: [
            {
              src: 'icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    optimizeDeps: {
      exclude: ['@xenova/transformers']
    }
  };
});
