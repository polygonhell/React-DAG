import React, { forwardRef, memo, ReactNode, useImperativeHandle } from "react"
import { useRef } from "react"
import { DraggableCore, DraggableEventHandler } from "react-draggable"
import { nodeContext } from "./contexts"



interface NodeWrapperProperties {
  id: string
  scale: number
  pos: [number, number]
  children?: ReactNode
  onMove: (id: string, pos: [number, number]) => void
  onHandleDown: (node: string, handle: string) => void
  onHandleUp: (node: string, handle: string) => void
}

interface NodeWrapperState {
  id: string
  pos: [number, number]

}

interface Handle {
  id: string,
  ref: React.RefObject<HTMLDivElement>
}

export const NodeWrapper = memo(forwardRef(({ id, pos, scale, children, onMove, onHandleDown, onHandleUp }: NodeWrapperProperties, ref): JSX.Element => {
  let handles: Handle[] = []
  const originalPos = pos
  let currentPos = originalPos
  let currentScale = scale
  let dragPos = [0,0]
  const divRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    getState(): NodeWrapperState {
      return { id, pos: currentPos || pos }
    },
    getHandlePos(id: string): [number, number] {
      const current = handles.find(h => h.id === id)?.ref.current
      const x = (current?.offsetLeft || 0) + (current?.offsetWidth || 0) / 2 + currentPos[0]
      const y = (current?.offsetTop || 0) + (current?.offsetHeight || 0) / 2 + currentPos[1]
      return [x, y]
      // return currentPos 
    },
    setScale(scale: number) { currentScale = scale },
    getAlert() {
      alert("getAlert from NodeWrapper")
    }
  }))

  function registerHandle(handleId: string, ref: React.RefObject<HTMLDivElement>) {
    handles.push({ id: handleId, ref })
    // console.log(`+ Registering Handle ${handleId} with Node ${id} handles=${JSON.stringify(handles)}`)
  }

  function onMouseDownHandle(handleId: string) {
    onHandleDown(id, handleId)
  }
  function onMouseUpHandle(handleId: string) {
    onHandleUp(id, handleId)
  }

  const onStartDrag: DraggableEventHandler = (e, data) => {
    dragPos = [data.x/currentScale - currentPos[0], data.y/currentScale - currentPos[1]]
    // console.log (`Drag Start ${}`)
    e.stopPropagation()
  }

  const onDrag: DraggableEventHandler = (e, data) => {
    currentPos = [data.x/currentScale - dragPos[0] , data.y/currentScale - dragPos[1]]
    onMove(id, currentPos)
    if (divRef.current) {
      divRef.current.style.setProperty("left", `${currentPos[0]}px`)
      divRef.current.style.setProperty("top", `${currentPos[1]}px`)
    }
    e.stopPropagation()
  }

  return <DraggableCore onDrag={onDrag} onStart={onStartDrag} >
    <div ref={divRef} style={{ position: "absolute", left: currentPos[0], top: currentPos[1], display: "inline-block" }}>
      <nodeContext.Provider value={{ registerHandle, onMouseDownHandle, onMouseUpHandle }}>
        {children}
      </nodeContext.Provider>
    </div>
  </DraggableCore>
}))

