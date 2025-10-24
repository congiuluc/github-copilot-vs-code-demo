import { defineConfig, mergeConfig } from 'vite'
import { defineConfig as defineTestConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const port = Number(process.env.PORT) || 5176
const strictPort = Boolean(process.env.PORT)
const host = process.env.HOST || '127.0.0.1'

// https://vitejs.dev/config/
export default mergeConfig(
  defineConfig({
    plugins: [react()],
    server: {
      host,
      port,
      strictPort,
      proxy: {
        '/api': {
          target: process.env.services__todoapi__http__0 || 'http://localhost:5255',
          changeOrigin: true,
        },
      },
    },
  }),
  defineTestConfig({
    test: {
      environment: 'happy-dom',
      globals: true,
    },
  })
)
