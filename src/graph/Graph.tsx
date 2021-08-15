import React, { forwardRef, HTMLAttributes, useEffect, useImperativeHandle, useState, useRef, createRef } from "react"
import ReactDOM from "react-dom"
import Draggable from "react-draggable"
import { DefaultNode } from "./DefaultNode"
import { Handle } from "./Handle"
import { NodeWrapper } from "./NodeWrapper"
import "./types"
import { GraphEdge, GraphNode, INode, NodeJSX } from "./types"






export interface Elements {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

interface GraphProps extends HTMLAttributes<HTMLElement> {
  elements: Elements
}



const defaultNodeType : Record<string, NodeJSX<any>> = {
  default: DefaultNode
}

enum UpdateType {
  None,
  Dragging,
}

interface UpdateState {
  type: UpdateType,
  origPos:[number, number],
  setPos(i: [number, number]) : void
}


export const Graph = forwardRef(({ elements }: GraphProps, ref): JSX.Element => {
  const nodeTypes = defaultNodeType
  const [nodes, setNodes] = useState<INode[]>([])
  const svgRef = useRef<SVGSVGElement>(null)

  let updateState : UpdateState | undefined = undefined


  function dragOnMove(this: GlobalEventHandlers, e: MouseEvent) : void {
    if (updateState && svgRef.current) {
      const cToS = svgRef.current.getScreenCTM()?.inverse() || undefined
      let point = svgRef.current.createSVGPoint(); point.x = e.clientX; point.y = e.clientY
      const clientPos = point.matrixTransform(cToS)

      updateState.setPos([updateState.origPos[0] + clientPos.x, updateState.origPos[1] + clientPos.y])
    }
  }
  function dragEndMove(this: GlobalEventHandlers, e: MouseEvent) : void {
    console.log("Drag End")
    updateState = undefined
    if (svgRef.current) {
      svgRef.current.onmousemove = null
      svgRef.current.onmouseup = null
      svgRef.current.onmouseleave = null
    }
  }

  function onStartDrag(origPos: [number, number], setPos:(f:[number, number]) => void): void {
    const type = updateState?.type || UpdateType.None
    if (type != UpdateType.None) {
      console.log(`Attempting to start drag when ${JSON.stringify(type)}`)
      return
    }
    if (svgRef.current) {
      updateState = {origPos, setPos, type: UpdateType.Dragging}
      svgRef.current.onmousemove = dragOnMove
      svgRef.current.onmouseup = dragEndMove
      svgRef.current.onmouseleave = dragEndMove
    }
  }
 

  useEffect(() => {
    const ns = elements.nodes.map ( n => new INode(nodeTypes, n) )
    setNodes(ns)
  }, [])

  useImperativeHandle(ref, () => ({
    getAlert() {
      alert("getAlert from Child");
    }
  }));


  const scale = 1.0

  return (
    <>
      <div style={{transformOrigin: "0 0", transform: `scale(${scale})`, width: 600, height: 600, backgroundColor: "blue"}}>
        { nodes.map(n => 
          <NodeWrapper id={n.id} scale={scale} pos={n.position}>
            { React.createElement(n.type, {data: n.data}) }
          </NodeWrapper>)
        }
      </div>
    </>
  )
})