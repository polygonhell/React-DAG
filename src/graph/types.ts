import React, { createRef, ExoticComponent } from "react"

export interface GraphNode<T = any> {
  id: string
  data?: T
  type?: string
  position: [number, number]
}

export interface GraphEdge<T = any> {
  id: string
  data?: T
  type?: string
  from: HandleRef
  to: HandleRef
}

export interface GraphExtents {
  top: number
  left: number
  bottom: number
  right: number
}
export interface GraphRef {
  addNode(node: GraphNode): void
  addEdge(edge: GraphEdge): void
  getExtents(): GraphExtents
}

export interface HandleRef {
  node: string
  handle: string
}

export interface EdgeRef {
  updatePath(path: [number, number][], sourcePosition?: Position, targetPosition?: Position): void
}
export class IEdge<T = any> {
  constructor(edgeTypes: Record<string, EdgeJSX<any>>, n: GraphEdge<T>) {
    this.id = n.id
    this.data = n.data
    this.typeName = n.type
    this.type = edgeTypes[n.type || "default"]
    this.from = n.from
    this.to = n.to
  }

  
  id: string
  data?: T
  typeName?: String
  type: EdgeJSX<any>
  from: HandleRef
  to: HandleRef
  refObject: React.RefObject<EdgeRef> = createRef<EdgeRef>()
}


export interface HandleInfo {
  pos: [number, number]
  position?: Position
}
export interface NodeRef {
  getHandleInfo(id: string) : HandleInfo
  setScale(scale: number) : void
  setPosition(pos: [number, number]) : void
}
export class INode<T = any> {
  constructor(nodeTypes: Record<string, NodeJSX<any>>, n: GraphNode<T>) {
    this.id = n.id
    this.data = n.data
    this.typeName = n.type
    this.type = nodeTypes[n.type || "default"]
    this.position = n.position
  }

  id: string
  data?: T
  typeName?: String
  type: NodeJSX<any>
  position: [number, number]
  refObject: React.RefObject<NodeRef> = createRef<NodeRef>()
  edges: string[] = []
}


export interface NodeProperties<T = {}> {
  data?: T
}

export interface EdgeProperties<T = {}> {
  path: [number, number][]
  data?: T
  sourcePosition?: Position
  targetPosition?: Position
}

export type NodeJSX<T> = ExoticComponent<NodeProperties<T> & React.RefAttributes<unknown>>
export type EdgeJSX<T> = ExoticComponent<EdgeProperties<T> & React.RefAttributes<unknown>>

export enum Position {
  Left = 0,
  Right,
  Top,
  Bottom,
}