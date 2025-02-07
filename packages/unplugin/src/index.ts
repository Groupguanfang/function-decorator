import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { enhanceProgram, transformFnDecoratorProgram } from '@function-decorator/oxc-parser'
import { createFilter } from '@rollup/pluginutils'
import { parseSync } from 'oxc-parser'
import { createUnplugin } from 'unplugin'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options = {}) => {
  if (!options.include)
    options.include = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx']

  const filter = createFilter(options?.include, options?.exclude)
  return {
    name: 'naily:function-decorator',
    enforce: 'pre',
    transformInclude(id) {
      return filter(id)
    },
    transform(code, id) {
      const result = enhanceProgram(parseSync(id, code))
      const magicString = transformFnDecoratorProgram(result)

      return {
        code: magicString.toString(),
        map: magicString.generateMap(),
      }
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
