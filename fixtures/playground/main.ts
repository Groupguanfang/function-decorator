/* eslint-disable no-console */
if (!Symbol.metadata)
  // @ts-expect-error
  Symbol.metadata = Symbol('metadata')

export function Component(_target: (...args: any[]) => any, _ctx: any): any {}

@Component
function App(): any {
  return 'Hello World'
}

console.dir(App)
