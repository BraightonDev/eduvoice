import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,             // 🔓 permite conexiones externas (necesario para Live Share)
    port: 5173,             // puedes dejarlo así o cambiarlo si ya está en uso
    allowedHosts: 'all'     // 🔓 permite que Live Share acceda sin bloquear el host
  }
})
