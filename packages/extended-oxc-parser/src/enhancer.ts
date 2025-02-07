import type { Decorator, MagicString, Program } from 'oxc-parser'
import { parseSync } from 'oxc-parser'
import { deepWalk, getPreviousNodes } from './walk'

declare module '@oxc-project/types' {
  interface Function {
    decorators: Array<Decorator>
  }
}

export interface EnhancedProgramResult {
  program: Program
  magicString: MagicString
}

export function enhanceProgram<TResult extends EnhancedProgramResult>({ program, magicString, ...rest }: TResult): TResult {
  const newProgram = program
  deepWalk(newProgram, {
    Function(node) {
      const previousNodes = getPreviousNodes(node, program)
      const lastPreviousNode = previousNodes[previousNodes.length - 1]
      const text = magicString.getSourceText(lastPreviousNode ? lastPreviousNode.end : 0, node.start)
      if (!text)
        return
      node.decorators = generateDecorators(text, lastPreviousNode ? lastPreviousNode.end : 0, node.start)
    },
  })
  return { program: newProgram, magicString, ...rest } as TResult
}

const generateSpace = (length: number): string => ' '.repeat(length)

function generateDecorators(text: string, decoratorsStart: number, _decoratorsEnd: number): Decorator[] {
  const decorators: Decorator[] = []
  // 使用正则表达式匹配装饰器
  const decoratorPattern = /@\w+(?:\([^)]*\))?/g
  let match
  // eslint-disable-next-line no-cond-assign
  while ((match = decoratorPattern.exec(text)) !== null) {
    const decoratorStart = decoratorsStart + match.index
    const decoratorEnd = decoratorStart + match[0].length

    // 生成space 这样就能得到对应的`start`和`end`
    // slice 1即删掉`@`，因此generateSpace必须要 + 1，补回去一个space
    const parseResult = parseSync('test.ts', generateSpace(decoratorStart + 1) + match[0].slice(1))
    const expressionStatement = parseResult.program.body.find(node => node.type === 'ExpressionStatement')
    if (!expressionStatement)
      continue

    decorators.push({
      start: decoratorStart,
      end: decoratorEnd,
      type: 'Decorator',
      expression: expressionStatement.expression,
    })
  }

  return decorators
}
