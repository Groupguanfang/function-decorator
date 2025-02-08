import React from 'react'

export function useChildren(): React.FC {
  return () => (
    <div>
      <div>
        I'm a children
      </div>
    </div>
  )
}
