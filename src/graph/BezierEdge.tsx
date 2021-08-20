import { memo } from "react"
import { EdgeProperties, Position } from "./types"


type Props = EdgeProperties<{}>

function toPathString(path: [number, number][], sourcePosition: Position = Position.Right, targetPosition: Position = Position.Left): string {
  const source = path[0]
  const target = path[path.length - 1]
  const leftAndRight : Position[] = [Position.Left, Position.Right]
  const [sourceX, sourceY] = source
  const [targetX, targetY] = target
  const [cX, cY] = [(sourceX + targetX)/2, (sourceY + targetY/2)]

  // Default is top/bottom
  let out = `M${sourceX},${sourceY} C${sourceX},${cY} ${targetX},${cY} ${targetX},${targetY}`;
  if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    out = `M${sourceX},${sourceY} C${cX},${sourceY} ${cX},${targetY} ${targetX},${targetY}`;
  } else if (leftAndRight.includes(targetPosition)) {
    out = `M${sourceX},${sourceY} C${sourceX},${targetY} ${sourceX},${targetY} ${targetX},${targetY}`;
  } else if (leftAndRight.includes(sourcePosition)) {
    out = `M${sourceX},${sourceY} C${targetX},${sourceY} ${targetX},${sourceY} ${targetX},${targetY}`;
  }
  return out
}

export const BezierEdge = memo(({path, sourcePosition, targetPosition} : Props) : JSX.Element => {
  return <path d={toPathString(path, sourcePosition, targetPosition)} stroke="red" strokeWidth={3} fill="none" />
})
