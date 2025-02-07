# @function-decorator/unplugin

[![NPM version](https://img.shields.io/npm/v/@function-decorator/unplugin?color=a1b858&label=)](https://www.npmjs.com/package/@function-decorator/unplugin)

Function decorator polyfill for vite, rollup, rolldown, webpack and more.

## Install

```bash
npm i @function-decorator/unplugin
```

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
