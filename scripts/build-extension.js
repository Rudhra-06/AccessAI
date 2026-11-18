import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { build } from 'vite';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputDirectory = 'dist-extension';
const sharedConfig = {
  configFile: false,
  root,
  base: './',
  plugins: [react()],
};

await build({
  ...sharedConfig,
  publicDir: resolve(root, 'public'),
  build: {
    outDir: outputDirectory,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(root, 'popup.html'),
        dashboard: resolve(root, 'dashboard.html'),
        onboarding: resolve(root, 'onboarding.html'),
        demo: resolve(root, 'demo.html'),
        index: resolve(root, 'index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});

for (const [input, output, name] of [
  ['src/background/serviceWorker.js', 'background/serviceWorker.js', 'AccessAIBackground'],
  ['src/content/contentScript.jsx', 'content/contentScript.js', 'AccessAIContent'],
]) {
  await build({
    ...sharedConfig,
    publicDir: false,
    build: {
      outDir: outputDirectory,
      emptyOutDir: false,
      rollupOptions: {
        input: resolve(root, input),
        output: {
          format: 'iife',
          name,
          inlineDynamicImports: true,
          entryFileNames: output,
        },
      },
    },
  });
}
