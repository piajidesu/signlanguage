import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },server:{
    proxy:{
      '/translator':{
        target:'http://192.168.87.47:9902/',
        changeOrigin:true,
        // rewrite : path => path.replace(/^tran)
      },
      '/generator':{
        target:'http://192.168.87.47:9902',
        changeOrigin:true,
      },
      '/api/save':{
        target:'http://127.0.0.1:3301',
        changeOrigin:true,
      },
      '/api/get_history':{
        target:'http://127.0.0.1:3301',
        changeOrigin:true,
      },
      '/api/delete':{
        target:'http://127.0.0.1:3301',
        changeOrigin:true,
      },
      '/api/collect':{
        target:'http://127.0.0.1:3301',
        changeOrigin:true,
      },
      '/api/delete_all':{
        target:'http://127.0.0.1:3301',
        changeOrigin:true,
      },
    }
  }
})


