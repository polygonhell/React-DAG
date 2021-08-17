import React, { forwardRef, HTMLAttributes, useEffect, useImperativeHandle, useState, MouseEventHandler } from "react"

interface EdgeProps {
  path: [number, number][]

}

function toPathString(path: [number, number][]): string {
  let out = `M ${path[0][0]} ${path[0][1]}`
  path.slice(1).forEach(point => {
    out = out + ` L ${point[0]} ${point[1]}`
  })
  return out
}

export const EdgeWrapper = forwardRef(({ path }: EdgeProps, ref): JSX.Element => {
  const [currrentPath, setCurrentPath] = useState<[number, number][]>(path)

  useImperativeHandle(ref, () => ({
    updatePath(path: [number, number][]): void {
      setCurrentPath(path)
    },
  }))



  return <path d={toPathString(currrentPath)} stroke="red" strokeWidth={3} fill="none" />
})