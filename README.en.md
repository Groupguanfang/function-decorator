# Function Decorator Support

[简体中文](./README.md) | English

This is a repository for adding `function decorator` support to existing TypeScript.

## 🎯 Project Goals

It's simple: support `named functions` with decorators, such as:

```ts
function hello(target: (...args: any[]) => any, ctx: FunctionDecoratorContext) {
  console.log('Decorated!')
}

// Correct usage
@hello
export function test() {
  console.log('hello')
}

// Incorrect usage
function test() {
  @hello // This is not allowed❗️
  return function () {}
}
```

As you can see, the `hello` function is a decorator. The decorator receives two parameters:

- target: the function being decorated
- ctx: decorator context

The signature of the decorator is based on the `TC39` [proposal for function and object literal decorators](https://github.com/tc39/proposal-function-and-object-literal-element-decorators), as follows:

```ts
interface FunctionDecoratorContext {
  kind: 'function'
  // Name of the decorated function
  name: string
  // Metadata of the decorated function
  metadata: object
  // Add an initializer to be called before the decorated function is invoked
  addInitializer: (initializer: () => void) => void
}

type FunctionDecorator = (
  // Function being decorated
  target: (...args: any[]) => any,
  // Decorator context
  ctx: FunctionDecoratorContext,
) => void
```

Any function that follows this signature can be used as a function decorator.

## ✒️ ESLint

The repository provides an ESLint package. If you encounter an ESLint error stating "decorators cannot appear here," you can install this package to resolve it.

```bash
pnpm add -D @function-decorator/eslint
```

Then modify your ESLint configuration. If you're using antfu's `@antfu/eslint-config`, you just need to add a little bit to your `eslint.config.js`:

```js
import antfu from '@antfu/eslint-config'
import { overrideParser } from '@function-decorator/eslint'

export default antfu().override('antfu/typescript/parser', overrideParser)
```

This effectively overrides the TypeScript parser object of `@antfu/eslint-config`.

## 🍽️ TypeScript

If you encounter a `TS2306` error, the repository provides a VSCode plugin to ignore this error, which you can install directly from the VSCode marketplace:

VSCode Marketplace Link: [https://marketplace.visualstudio.com/items?itemName=NailyZero.vscode-naily-function-decorator](https://marketplace.visualstudio.com/items?itemName=NailyZero.vscode-naily-function-decorator)

## 🧩 Plugin

The repository provides an `unplugin` plugin that supports build tools like `webpack`, `vite`, `rollup`, `esbuild`, `rolldown`, `rspack`, etc.

```bash
pnpm add -D @function-decorator/unplugin
```

Then you can use this plugin in various build tool configuration files:

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

## 🧠 Inspiration

Thanks to the following repositories for inspiring this idea and helping to bring it to fruition:

- [unplugin](https://github.com/unjs/unplugin)
- [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)