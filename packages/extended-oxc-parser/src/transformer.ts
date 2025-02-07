import type { TSType } from 'oxc-parser'
import type { EnhancedProgramResult } from './enhancer'
import MagicString from 'magic-string'
import { deepWalk } from './walk'

export interface TransformOptions {
  metadata?: boolean
}

export function transformFnDecoratorProgram<TResult extends EnhancedProgramResult>({ program, magicString }: TResult, options: TransformOptions = {}): MagicString {
  const text = magicString.toString()
  const newMagicString = new MagicString(text)

  deepWalk(program, {
    Function(node) {
      if (!('decorators' in node) || !Array.isArray(node.decorators) || node.decorators.length === 0)
        return
      if (!node.id || !node.body)
        return
      if (node.type === 'TSDeclareFunction' || node.type === 'TSEmptyBodyFunctionExpression')
        return

      if (options && options.metadata !== false) {
        const paramTypes = node.params.items.map((item) => {
          if (item.type === 'FormalParameter') {
            if (!item.pattern.typeAnnotation)
              return 'Object'
            return tsTypeToConstructor(
              item.pattern.typeAnnotation.typeAnnotation,
              newMagicString.slice(
                item.pattern.typeAnnotation.typeAnnotation.start,
                item.pattern.typeAnnotation.typeAnnotation.end,
              ),
            )
          }
          else if (item.type === 'RestElement') {
            if (!item.typeAnnotation)
              return 'Object'
            return tsTypeToConstructor(
              item.typeAnnotation.typeAnnotation,
              newMagicString.slice(
                item.typeAnnotation.typeAnnotation.start,
                item.typeAnnotation.typeAnnotation.end,
              ),
            )
          }
          return 'Object'
        }).join(', ')
        newMagicString.appendRight(node.end, `\nif (!${node.id.name}[Symbol.metadata]) ${node.id.name}[Symbol.metadata] = {};\n${node.id.name}[Symbol.metadata]['design:paramtypes'] = [${paramTypes}];`)
      }

      for (const decorator of node.decorators) {
        const decoratorText = newMagicString.slice(decorator.expression.start, decorator.expression.end)
        newMagicString.appendRight(node.end, `\n${decoratorText}(${node.id.name}, { kind: 'function', name: '${node.id.name}', metadata: ${node.id.name}[Symbol.metadata], addInitializer: (fn) => { if (!${node.id.name}['__initializer__']) ${node.id.name}['__initializer__'] = []; ${node.id.name}['__initializer__'].push(fn); } });`)
      }

      // Remove decorators
      const firstDecorator = node.decorators[0]
      const lastDecorator = node.decorators[node.decorators.length - 1]
      newMagicString.remove(firstDecorator.start, lastDecorator.end)

      // Add initializer
      const firstStatement = node.body.statements[0]
      newMagicString.appendRight(firstStatement ? firstStatement.start : node.body.start + 1, `\n${newMagicString.getIndentString()}(${node.id.name}['__initializer__'] || []).map(i => i());\n`)
    },
  })

  return newMagicString
}

function getTryingText(id: string): string {
  return `(() => { try { return typeof ${id} === 'undefined' ? Object : ${id} } catch (e) { return Object } })()`
}

function tsTypeToConstructor(typeNode: TSType, tryingId: string): string {
  switch (typeNode.type) {
    case 'TSStringKeyword':
      return 'String'
    case 'TSNumberKeyword':
      return 'Number'
    case 'TSBooleanKeyword':
      return 'Boolean'
    case 'TSNullKeyword':
      return 'null'
    case 'TSUndefinedKeyword':
      return 'undefined'
    case 'TSLiteralType':
      return typeNode.literal.type === 'Literal' ? literalValueToConstructor(typeNode.literal.value) : getTryingText(tryingId)
    case 'TSArrayType':
      return `Array`
    case 'TSTupleType':
      return 'Array'
    case 'TSBigIntKeyword':
      return 'BigInt'
    case 'TSSymbolKeyword':
      return 'Symbol'
    case 'TSTypeReference':
      return getTryingText(tryingId)
    default:
      return 'Object'
  }
}

function literalValueToConstructor(literal: unknown): string {
  switch (typeof literal) {
    case 'string':
      return 'String'
    case 'number':
      return 'Number'
    case 'boolean':
      return 'Boolean'
    case 'bigint':
      return 'BigInt'
    case 'undefined':
      return 'undefined'
    default:
      return 'Object'
  }
}
