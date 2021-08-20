import React, { forwardRef, memo, useImperativeHandle, useState } from "react"
import { EdgeJSX, Position } from "./types"

interface EdgeProps<T = any> {
  path: [number, number][]
  edgeClass: EdgeJSX<any>
  sourcePosition?: Position
  targetPosition?: Position
  data?: T
}



// export function EdgeComponent(component: ComponentType<EdgeProps>) {

// }

export const EdgeWrapper = memo(forwardRef(({ path, sourcePosition, targetPosition, edgeClass, data }: EdgeProps, ref): JSX.Element => {
  const [currrentPath, setCurrentPath] = useState<[number, number][]>(path)
  const [srcPosition, setSrcPosition] = useState<Position | undefined>(sourcePosition)
  const [tgtPosition, setTgtPosition] = useState<Position | undefined>(targetPosition)

  useImperativeHandle(ref, () => ({
    updatePath(path: [number, number][], sourcePosition?: Position, targetPosition?: Position): void {
      setCurrentPath(path)
      setSrcPosition(sourcePosition || srcPosition)
      setTgtPosition(targetPosition || tgtPosition)
    },
  }))

  return <>
    {React.createElement(edgeClass, { path: currrentPath, data, sourcePosition: srcPosition, targetPosition: tgtPosition })}
  </>

  // return <path d={toPathString(currrentPath)} stroke="red" strokeWidth={3} fill="none" />
}))