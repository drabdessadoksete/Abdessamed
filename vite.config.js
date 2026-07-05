// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.m4v'],
  // Root-relative assets keep nested client routes working on Cloudflare Pages.
  base: '/',
})
