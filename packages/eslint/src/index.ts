import type { Linter } from 'eslint'

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
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        if ((error.message || '').includes('Decorators are not valid here')) {
          if (typeof args[0] === 'string') {
            // eslint-disable-next-line regexp/no-super-linear-backtracking
            const result = args[0].replace(/(@\w+)(?=[\s\S]*function)/g, (match) => {
              return match.replace(/\S/g, ' ')
            })
            args[0] = result
          }
          return oldParseForESLint(...args)
        }
        throw error
      }
    },
  }
  parser = result
  return result
}

export function overrideParser(config: Linter.Config): Linter.Config {
  if (!config.languageOptions?.parser)
    return config
  config.languageOptions.parser = transformTSParser(config.languageOptions.parser)
  return config
}
