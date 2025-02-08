import React, { useState } from 'react'

if (!Symbol.metadata)
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  Symbol.metadata = Symbol('metadata')

@Entry
export function App(): React.ReactNode {
  const [count, setCount] = useState(0)
  if (!count)
    return

  return (
    <div onClick={() => setCount(count + 1)}>
      Hello World,
      {count}
    </div>
  )
}
