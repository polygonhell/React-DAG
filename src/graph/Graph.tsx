import React, { forwardRef, HTMLAttributes, useEffect, useImperativeHandle, useState, MouseEventHandler } from "react"
import { useCallback } from "react"
import { DefaultNode } from "./DefaultNode"
import { NodeWrapper } from "./NodeWrapper"
import "./types"
import { GraphEdge, GraphNode, IEdge, INode, NodeJSX } from "./types"






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
  // TODO might need an ordered Map
  const [nodes] = useState<Map<string, INode>>(new Map())
  const [edges] = useState<Map<string, IEdge>>(new Map())
  const [, setRender] = useState<number>(0)

  const forceRender = useCallback(() : void => {
    setRender(r => r+1)
  },[])

  const addNode = useCallback((node: GraphNode) : void => {
    nodes.set(node.id, new INode(nodeTypes, node))
    forceRender()
  }, [forceRender, nodes, nodeTypes])

  const addEdge = useCallback((edge: GraphEdge) : void => {
    edges.set(edge.id, new IEdge(edge))
    const fromNode = nodes.get(edge.from.node)
    fromNode?.edges.push(edge.id)
    const toNode = nodes.get(edge.from.node)
    toNode?.edges.push(edge.id)
    forceRender()
  }, [forceRender, edges, nodes])

  useEffect(() => {
    elements.nodes.forEach( n => addNode(n) )
    elements.edges.forEach( e => addEdge(e) )
  }, [elements, addEdge, addNode])

  useImperativeHandle(ref, () => ({
    addEdge,
    addNode,
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



  const scale = 2.0

  return (
    <>
      <div style={{ transformOrigin: "0 0", transform: `scale(${scale})`, width: 600, height: 600, backgroundColor: "blue" }} 
           onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}>
        {Array.from(nodes).map(([_, n]) =>
          <NodeWrapper ref={n.refObject} key={n.id} id={n.id} scale={scale} pos={n.position} onMove={onNodeMove}>
            {React.createElement(n.type, { data: n.data })}
          </NodeWrapper>)
        }

        <svg width={600} height={600} style={{position: "absolute", left: 0, top: 0, pointerEvents: "none"}}>
          <text x={100} y={100} color="red">
            Foo Bar Baz
          </text>
        </svg>
      </div>
    </>
  )
})