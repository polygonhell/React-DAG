import React, { forwardRef, HTMLAttributes, useEffect, useImperativeHandle, useState, useRef, MouseEventHandler, WheelEventHandler, memo } from "react"
import { useCallback } from "react"
import { DefaultNode } from "./DefaultNode"
import { NodeWrapper } from "./NodeWrapper"
import "./types"
import { EdgeJSX, EdgeRef, GraphEdge, GraphNode, HandleRef, IEdge, INode, NodeJSX } from "./types"
import "./graph.css"
import { EdgeWrapper } from "./EdgeWrapper"
import { StraightEdge } from "./StraightEdge"


let idCount = 0
function newId(): number {
  idCount++
  return idCount
}



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

// Graph is memoized to prevent automatic rerender on parent changes - parent will not know about current state
export const Graph = memo(forwardRef(({ elements }: GraphProps, ref): JSX.Element => {

  const nodeTypes = defaultNodeType
  const edgeTypes = defaultEdgeType
  // TODO might need an ordered Map
  const [nodes] = useState<Map<string, INode>>(new Map())
  const [edges] = useState<Map<string, IEdge>>(new Map())
  const [nodesRendered, setNodesRendered] = useState<boolean>(false)
  const [, setRender] = useState<number>(0)
  const innerRef = useRef<HTMLDivElement>(null)
  const newEdgeRef = useRef<EdgeRef>(null)

  // These don't force a render call, but will survive one
  const canvasPosition = useRef<[number, number]>([0, 0])
  const scale = useRef<number>(1.5)
  const graphId = useRef<number>(newId())

  // These are transient and won't survice a render call
  let dragSourcePosition: [number, number] | undefined = undefined
  let newEdgeSource: [number, number] | undefined = undefined
  let newEdgeSourceHandle: HandleRef = { node: "", handle: "" }

  // Force a render to occur - node or edge added to list
  function forceRender() { setRender(r => r + 1) }
  function newEdgeId(): string { return `__E${graphId.current}:${newId()}` }

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
    // if we repopulate, the nodes have not been rendered
    setNodesRendered(false)
  }, [elements, addEdge, addNode])

  const nodeArray = Array.from(nodes)

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


  function onHandleDown(node: string, handle: string) {
    // console.log(`Handle Down ${node}: ${handle}`)
    const pos = nodes.get(node)?.refObject.current?.getHandlePos(handle)
    if (pos) {
      newEdgeSourceHandle = { node, handle }
      newEdgeSource = pos
      if (newEdgeRef.current) {
        newEdgeRef.current.updatePath([pos, pos])
      }
    }
  }

  function onHandleUp(node: string, handle: string) {
    // console.log(`Handle Up ${node}: ${handle}`)
    const destNode = nodes.get(node)
    if (newEdgeSource && destNode) {
      const edgeExists = destNode.edges.some(e => {
        const edge = edges.get(e)
        return (
          (edge?.to.handle === handle && edge?.from.node === newEdgeSourceHandle.node && edge?.from.handle === newEdgeSourceHandle.handle) ||
          (edge?.from.handle === handle && edge?.to.node === newEdgeSourceHandle.node && edge?.to.handle === newEdgeSourceHandle.handle)
        )
      })
      if (!edgeExists) {
        const newEdge: GraphEdge = {
          id: newEdgeId(),
          data: undefined,
          from: newEdgeSourceHandle,
          to: { node, handle }
        }
        addEdge(newEdge)
        console.log(`Added new Edge ${newEdge.id}`)
      }
    }
    cancelCreateEdge()
  }

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

  function cancelCreateEdge(): void {
    if (newEdgeRef.current && newEdgeSource) {
      newEdgeRef.current.updatePath([newEdgeSource, newEdgeSource])
      newEdgeSource = undefined
    }
  }

  function transformString(): string {
    return `translate(${canvasPosition.current[0]}px,${canvasPosition.current[1]}px) scale(${scale.current})`
  }

  function clientToGraph(x: number, y: number): [number, number] {
    return [(x - canvasPosition.current[0]) / scale.current, (y - canvasPosition.current[1]) / scale.current]
  }

  const onMouseDown: MouseEventHandler = e => {
    // translate occurs after scale so I have to back it out
    dragSourcePosition = [canvasPosition.current[0] - e.clientX, canvasPosition.current[1] - e.clientY]
  }

  const onMouseMove: MouseEventHandler = e => {
    if (dragSourcePosition) {
      canvasPosition.current[0] = dragSourcePosition[0] + (e.clientX)
      canvasPosition.current[1] = dragSourcePosition[1] + (e.clientY)
      let style = innerRef.current?.style
      if (style)
        style.setProperty("transform", transformString())
    } else if (newEdgeRef.current && newEdgeSource) {
      const newEdgeDest: [number, number] = clientToGraph(e.clientX, e.clientY)
      newEdgeRef.current.updatePath([newEdgeSource, newEdgeDest])
    }
  }
  const onMouseUp: MouseEventHandler = e => {
    dragSourcePosition = undefined
    cancelCreateEdge()
  }
  const onMouseLeave: MouseEventHandler = e => { onMouseUp(e) }

  const onMouseWheel: WheelEventHandler = e => {
    const sx = e.clientX
    const sy = e.clientY
    // position under mouse is pos/S - T
    const pumX = (sx - canvasPosition.current[0]) / scale.current
    const pumY = (sy - canvasPosition.current[1]) / scale.current

    scale.current = scale.current * ((e.deltaY < 0) ? 1.1 : 0.9)
    // Inform the nodes of the scale change since they deal with dragging
    nodeArray.forEach(([_, n]) => { n.refObject.current?.setScale(scale.current) })

    // we now have to solve such that (sx - t')/s' = pumX 
    // t' = sx - s' * pumX
    canvasPosition.current[0] = sx - scale.current * pumX
    canvasPosition.current[1] = sy - scale.current * pumY

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
            <NodeWrapper ref={n.refObject} key={n.id} id={n.id} scale={scale.current} pos={n.position} onMove={onNodeMove} onHandleDown={onHandleDown} onHandleUp={onHandleUp}>
              {React.createElement(n.type, { data: n.data })}
            </NodeWrapper>)
          }
          {/* Can't render Edges until the Nodes have been rendered once */}
          {(nodesRendered) &&
            <svg className="edgeSVG" width="100%" height="100%" overflow="visible" >
              {Array.from(edges).map(([_, e]) =>
                <EdgeWrapper edgeClass={e.type} ref={e.refObject} key={e.id} path={edgePositions(e)} />
              )}

              {/* Edge used to display an edge being created */}
              <EdgeWrapper ref={newEdgeRef} edgeClass={edgeTypes["default"]} key="__newEdge" path={[[0, 0], [0, 0]]} />
            </svg>
          }
        </div>
      </div>
    </>
  )
}))