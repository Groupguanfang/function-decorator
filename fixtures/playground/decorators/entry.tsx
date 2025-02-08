import React from 'react'
import { createRoot } from 'react-dom/client'

export function Entry(selectors: string): void
export function Entry(selectors: keyof HTMLElementTagNameMap): void
export function Entry(selectors: string | keyof HTMLElementTagNameMap): any {
  const root = createRoot(document.querySelector(selectors)!)

  return async (App: (...args: any[]) => React.FC | Promise<React.FC>) => {
    const Root = await App()
    root.render(
      <React.StrictMode>
        <Root />
      </React.StrictMode>,
    )
  }
}
