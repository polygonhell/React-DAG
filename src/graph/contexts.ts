import { createContext } from "react"


export interface NodeContext {
  registerHandle(id: string, ref: React.RefObject<HTMLDivElement>): void
  onMouseDownHandle(handleId: string): void
}

export const nodeContext = createContext<NodeContext>(undefined!)