import React, { forwardRef, HTMLAttributes, useEffect, useImperativeHandle, useState, MouseEventHandler } from "react"
import { DefaultNode } from "./DefaultNode"
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

const defaultNodeType: Record<string, NodeJSX<any>> = {
  default: DefaultNode
}

export const Graph = forwardRef(({ elements }: GraphProps, ref): JSX.Element => {
  const nodeTypes = defaultNodeType
  const [nodes, setNodes] = useState<Map<string, INode>>(new Map())



  useEffect(() => {
    const ns : [string, INode][]= elements.nodes.map(n => [n.id, new INode(nodeTypes, n)])
    setNodes(new Map(ns))
  }, [elements.nodes, nodeTypes])

  useImperativeHandle(ref, () => ({
    getAlert() {
      alert("getAlert from Child")
    }
  }))


  function onNodeMove(id: string, pos:[number, number]) {
    // console.log(`Node ${id} moved to ${JSON.stringify(pos)}`)
    // Update the node position in the map - Note don't trigger render
    const existing = nodes.get(id)
    if (existing) {
      existing.position = pos
    }
    // Inform the Edges they need to be updated
  }

  const onMouseDown : MouseEventHandler = e => { }
  const onMouseMove : MouseEventHandler = e => { }
  const onMouseUp : MouseEventHandler = e => { }
  const onMouseLeave : MouseEventHandler = e => { onMouseUp(e) }



  const scale = 1.0

  return (
    <>
      <div style={{ transformOrigin: "0 0", transform: `scale(${scale})`, width: 600, height: 600, backgroundColor: "blue" }} 
           onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}>
        {Array.from(nodes).map(([_, n]) =>
          <NodeWrapper ref={n.refObject} key={n.id} id={n.id} scale={scale} pos={n.position} onMove={onNodeMove}>
            {React.createElement(n.type, { data: n.data })}
          </NodeWrapper>)
        }
      </div>
    </>
  )
})