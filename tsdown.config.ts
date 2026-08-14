import { defineConfig } from 'tsdown'

export default defineConfig({
  outputOptions: {
    entryFileNames: '[name].js'
  },
  css: {
    fileName: 'index.css'
  }
})
