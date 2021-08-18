import React, { forwardRef, useImperativeHandle, useState } from "react"
import { EdgeJSX } from "./types"

interface EdgeProps {
  path: [number, number][]
  edgeClass: EdgeJSX<any>
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