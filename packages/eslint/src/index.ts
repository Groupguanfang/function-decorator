import type { Linter } from 'eslint'
import { parse } from './parser'

export function transformTSParser(parser: Linter.Parser): Linter.Parser {
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  const oldParseForESLint = parser.parseForESLint

  const result = {
    ...parser,
    parseForESLint: (...args: any[]) => {
      try {
        return oldParseForESLint(...args)
      }
      catch (error) {
        // Filter out the error if it's because of a fn decorator

        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        if ((error.message || '').includes('Decorators are not valid here') || (error.message || '').includes('Declaration or statement expected')) {
          if (typeof args[0] === 'string')
            return parse(args[0], oldParseForESLint, args)
          throw error
        }
        throw error
      }
    },
  }
  parser = result as any
  return result as Linter.Parser
}

export function overrideParser(config: Linter.Config): Linter.Config {
  if (!config.languageOptions?.parser)
    return config
  config.languageOptions.parser = transformTSParser(config.languageOptions.parser)
  return config
}
