import React, { forwardRef, ForwardRefExoticComponent, HTMLAttributes, useImperativeHandle, useState, useRef, memo, MouseEventHandler } from "react"
import { GraphEdge, GraphNode, INode, NodeProperties } from "./types"
import { getTextSize } from "./Utilities"
import { makeStyles } from '@material-ui/core/styles'
import { Handle } from "./Handle"



interface NodeProps {
  label?: string
}

export const DefaultNode = memo( ({data} : NodeProperties<NodeProps> ) : JSX.Element => {
  return (
  <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
    <Handle id="1" style={{position:"relative", left:3 }}/>
      <div style={{display: "flex", flexDirection: "row", backgroundColor:"#0040aa", borderStyle:"solid", borderColor:"black", borderWidth:1, borderRadius: 5, userSelect: "none"}} >
        <div style={{width:5}}/>
        {data?.label}
        <div style={{width:5}}/>
      </div>
    <Handle id="2" style={{position:"relative", left:-3 }} />
  </div>)

})
