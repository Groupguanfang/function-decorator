declare global {
  interface FunctionDecoratorContext {
    kind: 'function'
    name: string
    metadata: DecoratorMetadata
    addInitializer: (initializer: () => void) => void
  }
}

export default 'slient is gloden'
