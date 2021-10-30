import { memo, useContext } from "react"
import { NodeProperties, Position } from "./types"
import { Handle } from "./Handle"
import { nodeContext } from "./contexts"


interface NodeProps {
  label?: string
}

export const DefaultNode = memo( ({data} : NodeProperties<NodeProps> ) : JSX.Element => {
  const context = useContext(nodeContext)
  const bc = (context.selected) ? "#b0b0b0" : "black"
  const bw = (context.selected) ? 3 : 1

  return (
  <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
    <Handle id="input" style={{position:"relative", left:3 }} position={Position.Left}/>
      <div style={{display: "flex", flexDirection: "row", backgroundColor:"#0040aa", borderStyle:"solid", borderColor:bc, borderWidth:bw, borderRadius: 5, userSelect: "none"}} >
        <div style={{width:5}}/>
        {data?.label}
        <div style={{width:5}}/>
      </div>
    <Handle id="output" style={{position:"relative", left:-3 }}  position={Position.Right}/>
  </div>)

})
