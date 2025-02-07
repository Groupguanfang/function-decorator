# Function Decorator

这是一个用于给现有的TypeScript添加`函数装饰器`支持的仓库。

## 🎯 项目目标

很简单: 支持`有名字的函数`添加装饰器。如：

```ts
function hello(target: (...args: any[]) => any, ctx: FunctionDecoratorContext) {
  console.log('Decorated!')
}

// 正确的用法
@hello
export function test() {
  console.log('hello')
}

// 错误的用法
function test() {
  @hello // 这是不被允许的❗️
  return function () {}
}
```

你可以看到，hello函数就是一个装饰器。装饰器接收了两个参数：

- target: 被装饰的函数
- ctx: 装饰器上下文

装饰器的签名，参考了`TC39`的[函数和object literal装饰器提案](https://github.com/tc39/proposal-function-and-object-literal-element-decorators)，如下：

```ts
interface FunctionDecoratorContext {
  kind: 'function'
  // 被装饰的函数名
  name: string
  // 被装饰的函数的元数据
  metadata: object
  // 添加初始化器, 这个虽然可以调用，但是`暂不支持!!`
  addInitializer: (initializer: () => void) => void
}

type FunctionDecorator = (
  // 被装饰的函数
  target: (...args: any[]) => any,
  // 装饰器上下文
  ctx: FunctionDecoratorContext,
) => void
```

只要遵循这个签名的函数都可以作为一个函数装饰器来使用。
