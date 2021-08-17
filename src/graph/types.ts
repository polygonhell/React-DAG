import React, { ForwardRefExoticComponent, createRef } from "react"

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

export interface HandleRef {
  node: string
  handle: string
}

export class IEdge<T = any> {
  constructor(n: GraphEdge<T>) {
    this.id = n.id
    this.data = n.data
    this.typeName = n.type
    this.from = n.from
    this.to = n.to
  }
  
  id: string
  data?: T
  typeName?: String
  from: HandleRef
  to: HandleRef
  refObject: React.RefObject<Element> = createRef<Element>()
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
  refObject: React.RefObject<Element> = createRef<Element>()
  edges: string[] = []
}


export interface NodeProperties<T = {}> {
  data?: T
}

export type NodeJSX<T> = ForwardRefExoticComponent<NodeProperties<T> & React.RefAttributes<unknown>>

