import { createContext } from "react"


export interface NodeContext {
  registerHandle(str: string): void
  onMouseDownHandle(handleId: string): void
}

export const nodeContext = createContext<NodeContext>(undefined!)