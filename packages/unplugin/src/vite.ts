import type { Plugin } from 'vite'
import type { Options } from './types'
import { createVitePlugin } from 'unplugin'
import { unpluginFactory } from '.'
import FnDecoratorEsbuildPlugin from './esbuild'

export default (options?: Options): any => {
  return {
    ...createVitePlugin(unpluginFactory)(options),
    config(config) {
      if (!config.optimizeDeps)
        config.optimizeDeps = {}
      if (!config.optimizeDeps.esbuildOptions)
        config.optimizeDeps.esbuildOptions = {}
      if (!config.optimizeDeps.esbuildOptions.plugins)
        config.optimizeDeps.esbuildOptions.plugins = []

      // Use as the optimizeDeps plugin to transform the code.
      config.optimizeDeps.esbuildOptions.plugins.push(FnDecoratorEsbuildPlugin(options) as any)
    },
  } as Plugin
}
