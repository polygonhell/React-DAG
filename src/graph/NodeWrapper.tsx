import React, { forwardRef, ReactNode, useImperativeHandle } from "react"
import Draggable, { DraggableEventHandler } from "react-draggable"
import { nodeContext } from "./contexts"



interface NodeWrapperProperties {
  id: string
  scale: number
  pos: [number, number]
  children?: ReactNode
  onMove: (id: string, pos: [number, number]) => void
}

interface NodeWrapperState {
  id: string
  pos: [number, number]

}

interface Handle {
  id: string,
  ref: React.RefObject<HTMLDivElement>
}

export const NodeWrapper = forwardRef(({ id, pos, scale, children, onMove }: NodeWrapperProperties, ref): JSX.Element => {
  let handles: Handle[] = []
  const originalPos = pos
  let currentPos = originalPos

  useImperativeHandle(ref, () => ({
    getState(): NodeWrapperState {
      return { id, pos: currentPos || pos }
    },
    getHandlePos(id: string): [number, number] {
      const handle = handles.find(h => h.id === id)
      const rect = handle?.ref.current?.getBoundingClientRect()
      const current = handle?.ref.current
      const x = (current?.offsetLeft || 0) + (current?.offsetWidth || 0) / 2 + currentPos[0]
      const y = (current?.offsetTop || 0) + (current?.offsetHeight || 0) / 2 + currentPos[1]
      return [x, y]
      // return currentPos 
    },
    getAlert() {
      alert("getAlert from NodeWrapper")
    }
  }))

  function registerHandle(handleId: string, ref: React.RefObject<HTMLDivElement>) {
    handles.push({ id: handleId, ref })
    // console.log(`+ Registering Handle ${handleId} with Node ${id} handles=${JSON.stringify(handles)}`)
  }

  function onMouseDownHandle(handleId: string) {
    console.log(`MouseDownHandle ${handleId} with Node ${id}`)
  }

  const onDrag: DraggableEventHandler = (e, data) => {
    currentPos = [data.x + originalPos[0], data.y + originalPos[1]]
    onMove(id, currentPos)
  }


  return <Draggable scale={scale} onDrag={onDrag}>
    <div style={{ position: "absolute", left: pos[0], top: pos[1], display: "inline-block" }}>
      <nodeContext.Provider value={{ registerHandle, onMouseDownHandle }}>
        {children}
      </nodeContext.Provider>
    </div>
  </Draggable>
})

