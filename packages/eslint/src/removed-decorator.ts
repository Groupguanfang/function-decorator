import type { Decorator, Function } from 'oxc-parser'

export class RemovedDecoratorMap extends Map<Function, Decorator[]> {
  getFunctionNodeByRange(range: [number, number]): Function | undefined {
    for (const [node] of this.entries()) {
      if (node.start === range[0] && node.end === range[1])
        return node
    }
  }
}
