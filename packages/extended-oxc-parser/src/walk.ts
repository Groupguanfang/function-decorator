import type { CallExpression, Class, ClassElement, Expression, Function, NewExpression, Program, Statement } from 'oxc-parser'

export type Node = Statement | Expression | ClassElement

export interface FunctionDeclaration extends Function {
  type: 'FunctionDeclaration'
}

export interface FunctionExpression extends Function {
  type: 'FunctionExpression'
}

export interface TSDeclareFunction extends Function {
  type: 'TSDeclareFunction'
}

export interface TSEmptyBodyFunctionExpression extends Function {
  type: 'TSEmptyBodyFunctionExpression'
}

export interface ClassDeclaration extends Class {
  type: 'ClassDeclaration'
}

export interface Visitors {
  CallExpression?: (node: CallExpression, parent: Node[]) => void
  FunctionDeclaration?: (node: FunctionDeclaration, parent: Node[]) => void
  Function?: (node: Function, parent: Node[]) => void
  FunctionExpression?: (node: FunctionExpression, parent: Node[]) => void
  TSDeclareFunction?: (node: TSDeclareFunction, parent: Node[]) => void
  TSEmptyBodyFunctionExpression?: (node: TSEmptyBodyFunctionExpression, parent: Node[]) => void
  NewExpression?: (node: NewExpression, parent: Node[]) => void
  ClassDeclaration?: (node: ClassDeclaration, parent: Node[]) => void
  All?: (node: Node, parent: Node[]) => void
}

export function deepWalk(node: Program, visitors: Visitors = {}): void {
  function walk(walkNode: Statement | Expression | ClassElement, parent: Node[]): void {
    if (walkNode.type === 'CallExpression') {
      visitors.CallExpression?.(walkNode, parent)
      visitors.All?.(walkNode, parent)
    }
    else if (walkNode.type === 'FunctionDeclaration') {
      visitors.FunctionDeclaration?.(walkNode as FunctionDeclaration, parent)
      visitors.Function?.(walkNode as Function, parent)
      visitors.All?.(walkNode, parent)
    }
    else if (walkNode.type === 'FunctionExpression') {
      visitors.FunctionExpression?.(walkNode as FunctionExpression, parent)
      visitors.Function?.(walkNode as Function, parent)
      visitors.All?.(walkNode, parent)
    }
    else if (walkNode.type === 'TSDeclareFunction') {
      visitors.TSDeclareFunction?.(walkNode as TSDeclareFunction, parent)
      visitors.Function?.(walkNode as Function, parent)
      visitors.All?.(walkNode, parent)
    }
    else if (walkNode.type === 'TSEmptyBodyFunctionExpression') {
      visitors.TSEmptyBodyFunctionExpression?.(walkNode as TSEmptyBodyFunctionExpression, parent)
      visitors.Function?.(walkNode as Function, parent)
      visitors.All?.(walkNode, parent)
    }
    else if (walkNode.type === 'NewExpression') {
      visitors.NewExpression?.(walkNode as NewExpression, parent)
      visitors.All?.(walkNode, parent)
    }
    else if (walkNode.type === 'ClassDeclaration') {
      visitors.ClassDeclaration?.(walkNode as ClassDeclaration, parent)
      visitors.All?.(walkNode, parent)
    }
    else {
      visitors.All?.(walkNode, parent)
    }

    // 遍历所有节点
    for (const key in walkNode) {
      const statement = (walkNode as any)[key]
      if (typeof statement !== 'object' || statement === null)
        continue

      if (Array.isArray(statement)) {
        for (const item of statement) {
          walk(item, parent ? [...parent, walkNode] : [walkNode])
        }
      }
      else if ('type' in statement && typeof statement.type === 'string') {
        walk(statement, parent ? [...parent, walkNode] : [walkNode])
      }
    }
  }

  for (const statement of node.body) {
    walk(statement, [])
  }
}

export type DeepRemovePositionResult<T extends Record<string, any>> = {
  [K in keyof T as K extends 'start' | 'end' ? never : K]: DeepRemovePositionResult<T[K]>
}

export function deepRemovePosition<T extends Record<string, any>>(node: Readonly<T>): DeepRemovePositionResult<T> {
  const result: any = Array.isArray(node) ? [] : {}

  for (const key in node) {
    if (key === 'start' || key === 'end')
      continue

    const value = node[key]
    result[key] = (typeof value === 'object' && value !== null) ? deepRemovePosition(value) : value
  }

  return result
}

export function getPreviousNodes(compareNode: Statement | Expression | ClassElement, program: Program): Node[] {
  const previousNodes: Node[] = []
  let isEnded = false
  deepWalk(program, {
    All(node) {
      if (isEnded)
        return

      if (node.start !== compareNode.start && node.end !== compareNode.end) {
        previousNodes.push(node)
      }
      else {
        isEnded = true
      }
    },
  })

  return previousNodes
}
