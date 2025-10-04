import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'

/** @type {import('vite').UserConfig} */
export default defineConfig(() => {
  return {
    plugins: [
      { enforce: 'pre', ...mdx() }, // Run MDX plugin before React plugin
      react({ include: /\.(jsx|js|mdx|ts|tsx)$/ }), // Include .mdx files for React Fast Refresh
      tsconfigPaths(),
      tailwindcss(),
    ],
    build: {
      outDir: 'build',
      sourcemap: true,
      emptyOutDir: true,
    },
    server: {
      port: 1234,
      open: true,
    },
    publicDir: 'public',
    envPrefix: 'REACT_APP_',
    css: {
      modules: {
        localsConvention: 'camelCase', // Optional: Ensures class names are imported as camelCase
      },
    },
  }
})
