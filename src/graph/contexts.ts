import { createContext } from "react"
import { Position } from "./types"


export interface NodeContext {
  registerHandle(id: string, ref: React.RefObject<HTMLDivElement>, position?: Position): void
  onMouseDownHandle(handleId: string): void
  onMouseUpHandle(handleId: string): void
}

export const nodeContext = createContext<NodeContext>(undefined!)