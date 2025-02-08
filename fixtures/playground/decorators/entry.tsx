import React from 'react'
import { createRoot } from 'react-dom/client'

export function Entry(id: string): any
export function Entry(id: keyof HTMLElementTagNameMap): any
export function Entry(id: string) {
  return (App: (...args: any[]) => any) => {
    createRoot(document.querySelector(id)!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  }
}
