import type { TSESTree } from '@typescript-eslint/typescript-estree'
import type { ESLintProgram } from './types'

interface FunctionDeclarationWithName extends TSESTree.FunctionDeclarationWithName {
  decorators?: TSESTree.Decorator[]
}

interface FunctionDeclarationWithOptionalName extends TSESTree.FunctionDeclarationWithOptionalName {
  decorators?: TSESTree.Decorator[]
}

export type DecoratorFunctionDeclaration = FunctionDeclarationWithName | FunctionDeclarationWithOptionalName

export interface Visitors {
  FunctionDeclaration?: (node: DecoratorFunctionDeclaration) => void
}

export function deepWalk(node: ESLintProgram, visitors: Visitors = {}): void {
  function walk(node: TSESTree.Node, parent: TSESTree.Node[]): void {
    if (node.type === 'FunctionDeclaration') {
      visitors.FunctionDeclaration?.(node as DecoratorFunctionDeclaration)
    }

    for (const key in node) {
      const statement = (node as any)[key]
      if (typeof statement !== 'object' || statement === null)
        continue

      if (Array.isArray(statement)) {
        for (const item of statement) {
          walk(item, parent ? [...parent, node] : [node])
        }
      }
      else if ('type' in statement && typeof statement.type === 'string') {
        walk(statement, parent ? [...parent, node] : [node])
      }
    }
  }

  for (const statement of node.body) {
    walk(statement, [])
  }
}
