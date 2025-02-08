export function getLineAndColumn(source: string, index: number): LineColumn {
  const lines = source.slice(0, index).split('\n')
  const lineNumber = lines.length
  const columnNumber = lines[lines.length - 1].length + 1 // +1 for 1-based index
  return { line: lineNumber, column: columnNumber }
}

export interface LineColumn {
  line: number
  column: number
}
