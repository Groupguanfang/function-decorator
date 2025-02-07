/* eslint-disable no-console */
import { parseSync } from 'oxc-parser'
import { it } from 'vitest'
import { enhanceProgram } from '../src'
import { transformFnDecoratorProgram } from '../src/transformer'

it('should test', () => {
  const result = enhanceProgram(parseSync('test.ts', '@hello export function test(a: string, b: number, c: boolean, d: 1, e: string[], f: [number], g: void, h: typeof test, i: test2, j: symbol, k: bigint, l: unknown) { return "hello world" }'))
  console.log('==== 增强后的AST ====')
  console.dir(result.program.body[0], { depth: null })
  const magicString = transformFnDecoratorProgram(result)
  console.log('==== 最终结果 ====')
  console.log(magicString.toString())
  console.log('==== END ====')
})
