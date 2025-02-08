import React from 'react'
import { createRoot } from 'react-dom/client'

export function Entry(id: string): void
export function Entry(id: keyof HTMLElementTagNameMap): void
export function Entry(id: string): any {
  return (App: (...args: any[]) => any) => {
    createRoot(document.querySelector(id)!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  }
}
