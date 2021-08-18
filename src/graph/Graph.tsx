import React, { forwardRef, HTMLAttributes, useEffect, useImperativeHandle, useState, useRef, MouseEventHandler, WheelEventHandler } from "react"
import { useCallback } from "react"
import { DefaultNode } from "./DefaultNode"
import { NodeWrapper } from "./NodeWrapper"
import "./types"
import { EdgeJSX, GraphEdge, GraphNode, IEdge, INode, NodeJSX } from "./types"
import "./graph.css"
import { EdgeWrapper } from "./EdgeWrapper"
import { StraightEdge } from "./StraightEdge"






export interface Elements {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

interface GraphProps extends HTMLAttributes<HTMLElement> {
  elements: Elements
  position?: [number, number]
}

const defaultNodeType: Record<string, NodeJSX<any>> = {
  default: DefaultNode
}

const defaultEdgeType: Record<string, EdgeJSX<any>> = {
  default: StraightEdge
}

export const Graph = forwardRef(({ elements, position }: GraphProps, ref): JSX.Element => {
  const nodeTypes = defaultNodeType
  const edgeTypes = defaultEdgeType
  // TODO might need an ordered Map
  const [nodes] = useState<Map<string, INode>>(new Map())
  const [edges] = useState<Map<string, IEdge>>(new Map())
  const [nodesRendered, setNodesRendered] = useState<boolean>(false)
  const [, setRender] = useState<number>(0)
  const innerRef = useRef<HTMLDivElement>(null)

  // Note these are not persised state because we don't want to render for every update - maybe use refs?
  let dragSourcePosition: [number, number] | undefined = undefined
  let canvasPosition: [number, number] = position || [0, 0]
  let scale = 1.5


  function forceRender() { setRender(r => r + 1) }

  const addNode = useCallback((node: GraphNode): void => {
    nodes.set(node.id, new INode(nodeTypes, node))
    forceRender()
  }, [nodes, nodeTypes])

  const addEdge = useCallback((edge: GraphEdge): void => {
    edges.set(edge.id, new IEdge(edgeTypes, edge))
    const fromNode = nodes.get(edge.from.node)
    fromNode?.edges.push(edge.id)
    const toNode = nodes.get(edge.to.node)
    toNode?.edges.push(edge.id)
    forceRender()
  }, [edges, nodes, edgeTypes])

  useEffect(() => {
    elements.nodes.forEach(n => addNode(n))
    elements.edges.forEach(e => addEdge(e))
  }, [elements, addEdge, addNode])

  const nodeArray = Array.from(nodes)
  // console.log(`rendered ${nodeArray.length} - ${nodeArray.length>0 && nodeArray[0][1].refObject.current != null}`)

  useEffect(() => {
    if (!nodesRendered && nodeArray.length > 0 && (nodeArray[0][1].refObject.current != null)) {
      setNodesRendered(true)
    }
  }, [nodesRendered, nodeArray])



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

  function transformString(): string { return `translate(${canvasPosition[0]}px,${canvasPosition[1]}px) scale(${scale})` }

  const onMouseDown: MouseEventHandler = e => { 
    // translate occurs after scale so I have to back it out
    dragSourcePosition = [canvasPosition[0] - e.clientX, canvasPosition[1] - e.clientY] 
  }
  const onMouseMove: MouseEventHandler = e => {
    if (dragSourcePosition) {
      canvasPosition[0] = dragSourcePosition[0] + (e.clientX)
      canvasPosition[1] = dragSourcePosition[1] + (e.clientY)
      let style = innerRef.current?.style
      if (style)
        style.setProperty("transform", transformString())
    }
  }
  const onMouseUp: MouseEventHandler = e => { dragSourcePosition = undefined }
  const onMouseLeave: MouseEventHandler = e => { onMouseUp(e) }

  const onMouseWheel: WheelEventHandler = e => {
    const sx = e.clientX
    const sy = e.clientY
    // position under mouse is pos/S - T
    const pumX = (sx - canvasPosition[0])/scale 
    const pumY = (sy - canvasPosition[1])/scale

    scale = scale * ((e.deltaY < 0) ? 1.1 : 0.9)
    // Inform the nodes of the scale change since they deal with dragging
    nodeArray.forEach(([_,n]) => { n.refObject.current?.setScale(scale)})

    // we now have to solve such that (sx - t')/s' = pumX 
    // t' = sx - s' * pumX
    canvasPosition[0] = sx - scale * pumX
    canvasPosition[1] = sy - scale * pumY

    let style = innerRef.current?.style
      if (style)
        style.setProperty("transform", transformString())
  }


  function edgePositions(e: IEdge): [number, number][] {
    const fromNode = nodes.get(e.from.node)?.refObject.current
    const fromPos = fromNode?.getHandlePos(e.from.handle)
    const toNode = nodes.get(e.to.node)?.refObject.current
    const toPos = toNode?.getHandlePos(e.to.handle)
    return ((fromPos && toPos) ? [fromPos, toPos] : [])
  }

  return (
    <>
      <div className="outerDiv" style={{ width: 600, height: 600 }}
           onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
           onWheel={onMouseWheel}
      >
        <div ref={innerRef} className="innerDiv" style={{ transform: transformString() }}>
          {nodeArray.map(([_, n]) =>
            <NodeWrapper ref={n.refObject} key={n.id} id={n.id} scale={scale} pos={n.position} onMove={onNodeMove}>
              {React.createElement(n.type, { data: n.data })}
            </NodeWrapper>)
          }
          {/* Can't render Edges until the Nodes have been rendered once */}
          {(nodesRendered) &&
            <svg className="edgeSVG" width="100%" height="100%" overflow="visible" >
              {Array.from(edges).map(([_, e]) =>
                <EdgeWrapper edgeClass={e.type} ref={e.refObject} key={e.id} path={edgePositions(e)} />
              )}
            </svg>
          }
        </div>
      </div>
    </>
  )
})