import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./internals/vitest/vitest.setup.ts'],
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}', 'src/**/__tests__/**/*.{ts,tsx,js,jsx}'],
    env: loadEnv('.env', process.cwd(), 'REACT_APP_'),
  },
})
