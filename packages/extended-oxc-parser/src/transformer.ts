import { EnhancedProgramResult } from "./enhancer";
import { deepWalk } from "./walk";
import MagicString from "magic-string";

export function transformFnDecoratorProgram<TResult extends EnhancedProgramResult>({ program, magicString }: TResult): MagicString {
  const text = magicString.toString()
  const newMagicString = new MagicString(text)

  deepWalk(program, {
    Function(node, parent) {
      if (!('decorators' in node) || !Array.isArray(node.decorators) || node.decorators.length === 0)
        return
      if (!node.id) return
      if (node.type === 'TSDeclareFunction' || node.type === 'TSEmptyBodyFunctionExpression') return

      for (const decorator of node.decorators) {
        const decoratorText = newMagicString.slice(decorator.expression.start, decorator.expression.end)
        newMagicString.appendRight(node.end, `\n${decoratorText}(${node.id.name}, { kind: 'function', name: '${node.id.name}', metadata: ${node.id.name}[Symbol.metadata], addInitializer: () => {} });`)
      }

      const firstDecorator = node.decorators[0]
      const lastDecorator = node.decorators[node.decorators.length - 1]
      newMagicString.remove(firstDecorator.start, lastDecorator.end)
    },
  })

  return newMagicString
}