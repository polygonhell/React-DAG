import { forwardRef, ReactNode, createContext } from "react"
import Draggable from "react-draggable"
import { nodeContext } from "./contexts"
import { Handle } from "./Handle"
import { NodeContext } from "./contexts"



interface NodeWrapperProperties {
  id: string
  scale: number
  pos: [number, number]
  children?: ReactNode
}

interface HookDetails {
  id: string
}




export const NodeWrapper = forwardRef(({id, pos, scale, children} : NodeWrapperProperties, ref) : JSX.Element => {
  let handles : string[] = []

  function registerHandle(str: string) {
    handles.push(`${id}+${str}`)
    console.log(`+ Registering Handle ${str} with Node ${id} handles=${JSON.stringify(handles)}`)
  }

  function onMouseDownHandle(handleId: string) {
    
    console.log(`MouseDownHandle ${handleId} with Node ${id}`)


  }

  return <Draggable scale={scale}>
    <div style={{position: "absolute", left: pos[0], top: pos[1], display: "inline-block"}}>
      <nodeContext.Provider value={{registerHandle, onMouseDownHandle}}>
        {children}
      </nodeContext.Provider>
    </div>
  </Draggable>
})

