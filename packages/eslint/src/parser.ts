import type { ParseForESLintResult } from './types'
import { enhanceProgram } from '@function-decorator/oxc-parser'
import MagicString from 'magic-string'
import { parseSync } from 'oxc-parser'
import { RemovedDecoratorMap } from './removed-decorator'

function replaceToSpace(start: number, end: number, magicString: MagicString): string {
  const text = magicString.slice(start, end)
  return text.replace(/\S/g, ' ')
}

interface RemovedResult {
  removedText: string
  removedDecorators: RemovedDecoratorMap
}

export function removeFnDecorators(code: string): RemovedResult {
  const magicString = new MagicString(code)
  const parseResult = parseSync('test.tsx', code)
  const removedDecorators = new RemovedDecoratorMap()
  const decoratorTextSet = new Set<string>()

  enhanceProgram({
    magicString: parseResult.magicString,
    program: parseResult.program,
    onGenerateDecorators(decorators, node) {
      if (!node.decorators || node.decorators.length === 0)
        return

      const firstDecorator = decorators[0]
      const lastDecorator = decorators[decorators.length - 1]
      const decoratorsStart = firstDecorator.start
      const decoratorsEnd = lastDecorator.end

      for (const decorator of decorators)
        decoratorTextSet.add(`${magicString.slice(decorator.start, decorator.end)}(${node.id!.name})`)
      magicString.overwrite(decoratorsStart, decoratorsEnd, replaceToSpace(decoratorsStart, decoratorsEnd, magicString))
      removedDecorators.set(node, decorators)
    },
  })

  for (const decoratorText of decoratorTextSet) {
    magicString.append(`\n${decoratorText.slice(1)}`)
  }

  return {
    removedText: magicString.toString(),
    removedDecorators,
  }
}

export function parse(code: string, oldParseFn: (...args: any[]) => ParseForESLintResult, args: any[]): ParseForESLintResult {
  const { removedText } = removeFnDecorators(code)
  const eslintParseResult = oldParseFn(removedText, ...args.slice(1))
  return eslintParseResult
}
