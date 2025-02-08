import React from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import FnDecorator from '../../packages/unplugin/src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    FnDecorator(),
    React(),
    AutoImport({ dirs: ['./decorators'], dts: './auto-imports.d.ts' }),
  ],
})
