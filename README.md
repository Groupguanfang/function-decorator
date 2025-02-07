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
  // 添加初始化器，将在被装饰函数调用前调用
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

## ✒️ ESLint

仓库提供了一个eslint包，如果遇到eslint报错提示“装饰器不能出现在这里”，可以安装这个包来解决。

```bash
pnpm add -D @function-decorator/eslint
```

然后修改你的eslint配置，如果使用antfu的`@antfu/eslint-config`，那么只需要在`eslint.config.js`中添加一点点东西即可：

```js
import antfu from '@antfu/eslint-config'
import { overrideParser } from '@function-decorator/eslint'

export default antfu().override('antfu/typescript/parser', overrideParser)
```

这相当于重写了`@antfu/eslint-config`的typescript解析器对象。

## 🍽️ TypeScript

如果遇到`TS2306`错误，仓库提供了一个vscode插件以供忽略这个错误，直接从vscode插件市场安装即可：

VSCode插件市场链接：[https://marketplace.visualstudio.com/items?itemName=NailyZero.vscode-naily-function-decorator](https://marketplace.visualstudio.com/items?itemName=NailyZero.vscode-naily-function-decorator)

## 🧩 插件

仓库提供了一个`unplugin`插件，支持`webpack`、`vite`、`rollup`、`esbuild`、`rolldown`、`rspack`等构建工具。

```bash
pnpm add -D @function-decorator/unplugin
```

然后你就可以在各种构建工具的配置文件中使用该插件了：

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import FnDecorator from '@function-decorator/unplugin/vite'

export default defineConfig({
  plugins: [
    FnDecorator({ /* options */ }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import FnDecorator from '@function-decorator/unplugin/rollup'

export default {
  plugins: [
    FnDecorator({ /* options */ }),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('@function-decorator/unplugin/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ['@function-decorator/unplugin/nuxt', { /* options */ }],
  ],
})
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('@function-decorator/unplugin/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
import FnDecorator from '@function-decorator/unplugin/esbuild'
// esbuild.config.js
import { build } from 'esbuild'

build({
  plugins: [FnDecorator()],
})
```

<br></details>

