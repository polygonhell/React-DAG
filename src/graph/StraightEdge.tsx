import { memo } from "react"
import { EdgeProperties } from "./types"


function toPathString(path: [number, number][]): string {
  let out = `M ${path[0][0]} ${path[0][1]}`
  path.slice(1).forEach(point => {
    out = out + ` L ${point[0]} ${point[1]}`
  })
  return out
}

export const StraightEdge = memo(({path} : EdgeProperties<{}>) : JSX.Element => {
  return <path d={toPathString(path)} stroke="red" strokeWidth={3} fill="none" />
})
