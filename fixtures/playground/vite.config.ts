import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import FnDecorator from '../../packages/unplugin/src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    FnDecorator(),
  ],
})
