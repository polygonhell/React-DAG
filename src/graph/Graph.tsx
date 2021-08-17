import React, { forwardRef, HTMLAttributes, useEffect, useImperativeHandle, useState, useRef, MouseEventHandler } from "react"
import { useCallback } from "react"
import { DefaultNode } from "./DefaultNode"
import { NodeWrapper } from "./NodeWrapper"
import "./types"
import { GraphEdge, GraphNode, IEdge, INode, NodeJSX } from "./types"
import "./graph.css"
import { EdgeWrapper } from "./EdgeWrapper"






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
  const [nodesRendered, setNodesRendered] = useState<boolean>(false)
  const [, setRender] = useState<number>(0)
  const outerRef = useRef<HTMLDivElement>(null)

  const forceRender = useCallback((): void => {
    setRender(r => r + 1)
  }, [])

  const addNode = useCallback((node: GraphNode): void => {
    nodes.set(node.id, new INode(nodeTypes, node))
    forceRender()
  }, [forceRender, nodes, nodeTypes])

  const addEdge = useCallback((edge: GraphEdge): void => {
    edges.set(edge.id, new IEdge(edge))
    const fromNode = nodes.get(edge.from.node)
    fromNode?.edges.push(edge.id)
    const toNode = nodes.get(edge.to.node)
    toNode?.edges.push(edge.id)
    forceRender()
  }, [forceRender, edges, nodes])

  useEffect(() => {
    elements.nodes.forEach(n => addNode(n))
    elements.edges.forEach(e => addEdge(e))
  }, [elements, addEdge, addNode])

  useImperativeHandle(ref, () => ({
    addEdge,
    addNode,
    getAlert() {
      alert("getAlert from Child")
    }
  }))

  // useEffect(() => forceRender(), [outerRef, forceRender])



  function onNodeMove(id: string, pos: [number, number]) {
    // console.log(`Node ${id} moved to ${JSON.stringify(pos)}`)
    // Update the node position in the map - Note don't trigger render
    const existing = nodes.get(id)
    if (existing) {
      existing.position = pos
      // Inform the Edges they need to be updated
      existing?.edges.forEach(e => {
        const edge = edges.get(e)
        edge?.refObject.current?.updatePath(edgePositions(edge))
      })
    }

  }

  const onMouseDown: MouseEventHandler = e => { }
  const onMouseMove: MouseEventHandler = e => { }
  const onMouseUp: MouseEventHandler = e => { }
  const onMouseLeave: MouseEventHandler = e => { onMouseUp(e) }


  const scale = 1.0

  function edgePositions(e: IEdge): [number, number][] {
    const fromNode = nodes.get(e.from.node)?.refObject.current
    const fromPos = fromNode?.getHandlePos(e.from.handle)
    const toNode = nodes.get(e.to.node)?.refObject.current
    const toPos = toNode?.getHandlePos(e.to.handle)
    return ((fromPos && toPos) ? [fromPos, toPos] : [])
  }

  const nodeArray = Array.from(nodes)

  useEffect(() => {
    if (!nodesRendered && nodeArray.length > 0 && (nodeArray[0][1].refObject.current != null)) {
      setNodesRendered(true)
    }
  },  [nodesRendered, nodeArray])

  return (
    <>
      <div ref={outerRef} style={{ transformOrigin: "0 0", transform: `scale(${scale})`, width: 600, height: 600, backgroundColor: "blue" }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}>
        {nodeArray.map(([_, n]) =>
          <NodeWrapper ref={n.refObject} key={n.id} id={n.id} scale={scale} pos={n.position} onMove={onNodeMove}>
            {React.createElement(n.type, { data: n.data })}
          </NodeWrapper>)
        }
        {(nodesRendered) &&
          <svg className="edgeSVG" width={600} height={600} >
            {Array.from(edges).map(([_, e]) =>
              <EdgeWrapper ref={e.refObject} key={e.id} path={edgePositions(e)} />
            )}
            <text x={100} y={100} color="red">
              Foo Bar Baz
            </text>
          </svg>
        }
      </div>
    </>
  )
})