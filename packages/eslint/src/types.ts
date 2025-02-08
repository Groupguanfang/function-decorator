import type { ScopeManager } from '@typescript-eslint/scope-manager'
import type { AST, ParserServices, TSESTree } from '@typescript-eslint/typescript-estree'
import type { VisitorKeys } from '@typescript-eslint/visitor-keys'

export interface ParseForESLintResult {
  ast: ESLintProgram
  scopeManager: ScopeManager
  services: ParserServices
  visitorKeys: VisitorKeys
}

export interface ESLintProgram extends AST<{ comment: true, tokens: true }> {
  comments: TSESTree.Comment[]
  range: [number, number]
  tokens: TSESTree.Token[]
}
