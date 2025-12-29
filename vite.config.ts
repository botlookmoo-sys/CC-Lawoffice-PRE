
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Sets base to relative path './' to ensure assets load correctly on GitHub Pages subdirectories
  base: '', 
  build: {
    outDir: 'dist',
  }
})
