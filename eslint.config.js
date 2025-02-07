import antfu from '@antfu/eslint-config'
import { overrideParser } from '@function-decorator/eslint'

export default antfu({
  type: 'lib',
  markdown: false,
}).override('antfu/typescript/parser', overrideParser)
