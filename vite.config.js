import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// React renders the site; Vue powers the terminal "island" mounted inside it.
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vue(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        // Split vendors so browsers can cache them independently
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react'
          if (/node_modules\/(vue|@vue)\//.test(id)) return 'vue'
          if (id.includes('node_modules/gsap/')) return 'gsap'
          if (id.includes('node_modules/react-icons/')) return 'icons'
        },
      },
    },
  },
})
