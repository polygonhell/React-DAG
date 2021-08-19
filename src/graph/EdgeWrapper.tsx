import React, { forwardRef, memo, useImperativeHandle, useState } from "react"
import { EdgeJSX } from "./types"

interface EdgeProps<T = any> {
  path: [number, number][]
  edgeClass: EdgeJSX<any>
  data?: T
}



// export function EdgeComponent(component: ComponentType<EdgeProps>) {

// }

export const EdgeWrapper = memo(forwardRef(({ path, edgeClass, data }: EdgeProps, ref): JSX.Element => {
  const [currrentPath, setCurrentPath] = useState<[number, number][]>(path)

  useImperativeHandle(ref, () => ({
    updatePath(path: [number, number][]): void {
      setCurrentPath(path)
    },
  }))

  return <>
    {React.createElement(edgeClass, { path: currrentPath, data: data })}
  </>

  // return <path d={toPathString(currrentPath)} stroke="red" strokeWidth={3} fill="none" />
}))