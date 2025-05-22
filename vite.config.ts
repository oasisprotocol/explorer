import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => {
  return {
    plugins: [react(), tsconfigPaths()],
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
    envPrefix: ['REACT_APP_', 'CI'],
  }
})
