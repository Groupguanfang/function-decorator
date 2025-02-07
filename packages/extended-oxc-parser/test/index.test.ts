import { it } from 'vitest'
import { transformFnDecoratorProgram } from '../src/transformer'
import { parseSync } from 'oxc-parser'
import { enhanceProgram } from '../src'

it('should test', () => {
  const result = enhanceProgram(parseSync('test.ts', '@hello export function test() {}'))
  console.log('==== 增强后的AST ====')
  console.dir(result.program.body[0], { depth: null })
  const magicString = transformFnDecoratorProgram(result)
  console.log('==== 最终结果 ====')
  console.log(magicString.toString())
  console.log('==== END ====')
})

