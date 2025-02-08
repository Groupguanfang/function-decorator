import React, { useState } from 'react'
import { useChildren } from './children'

if (!Symbol.metadata)
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  Symbol.metadata = Symbol('metadata')

@Entry('#app')
export function App(): React.FC {
  return () => {
    const [count, setCount] = useState(0)
    const Children = useChildren()

    return (
      <div onClick={() => setCount(count + 1)}>
        Hello World,
        {count}
        <Children />
      </div>
    )
  }
}
