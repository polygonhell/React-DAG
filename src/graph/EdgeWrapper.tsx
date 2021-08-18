import React, { ComponentType, forwardRef, ReactNode, useImperativeHandle, useState } from "react"
import { EdgeJSX, NodeJSX } from "./types"

interface EdgeProps {
  path: [number, number][]
  edgeClass: EdgeJSX<any>
}

function toPathString(path: [number, number][]): string {
  let out = `M ${path[0][0]} ${path[0][1]}`
  path.slice(1).forEach(point => {
    out = out + ` L ${point[0]} ${point[1]}`
  })
  return out
}


// export function EdgeComponent(component: ComponentType<EdgeProps>) {

// }

export const EdgeWrapper = forwardRef(({ path, edgeClass }: EdgeProps, ref): JSX.Element => {
  const [currrentPath, setCurrentPath] = useState<[number, number][]>(path)

  useImperativeHandle(ref, () => ({
    updatePath(path: [number, number][]): void {
      setCurrentPath(path)
    },
  }))

  return <>
    {React.createElement(edgeClass, {path: currrentPath})}
  </>

  // return <path d={toPathString(currrentPath)} stroke="red" strokeWidth={3} fill="none" />
})