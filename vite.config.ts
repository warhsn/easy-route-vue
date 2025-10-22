import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'EasyRoute',
      fileName: 'easy-route'
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      external: ['vue', 'vue-router', 'lodash-es'],
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          'lodash-es': '_'
        }
      }
    }
  }
})
