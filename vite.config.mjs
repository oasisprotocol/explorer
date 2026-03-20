import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'build',
      sourcemap: true,
      emptyOutDir: true,
    },
    resolve: {
      tsconfigPaths: true,
    },
    publicDir: 'public',
    envPrefix: 'REACT_APP_',
    css: {
      modules: {
        localsConvention: /** @type {'camelCase'} */ ('camelCase'), // Optional: Ensures class names are imported as camelCase
      },
    },
  }
})
