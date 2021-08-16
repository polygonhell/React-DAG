import React, { ForwardRefExoticComponent, createRef } from "react"

export interface GraphNode<T = {}> {
  id: string
  data?: T
  type?: string
  position: [number, number]
}

export interface GraphEdge<T = {}> {
  id: string
  data?: T
  type?: string
  from: string
  to: string
}

export class INode<T = {}> {
  constructor(nodeTypes: Record<string, NodeJSX<any>>, n: GraphNode<T>) {
    this.id = n.id
    this.data = n.data
    this.typeName = n.type
    this.type = nodeTypes[n.type || "default"]
    this.position = n.position
    // this.refObject = createRef<Element>()
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

