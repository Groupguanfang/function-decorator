import React, { useState } from 'react'
import { Entry } from './decorators/entry'

if (!Symbol.metadata)
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  Symbol.metadata = Symbol('metadata')

@Entry('#app')
function App(): React.ReactNode {
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
