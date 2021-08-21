import React, { forwardRef, memo, ReactNode, useImperativeHandle } from "react"
import { useRef } from "react"
import { DraggableCore, DraggableEventHandler } from "react-draggable"
import { nodeContext } from "./contexts"
import { HandleInfo, Position } from "./types"



interface NodeWrapperProperties {
  id: string
  scale: number
  pos: [number, number]
  children?: ReactNode
  onMove: (id: string, pos: [number, number]) => void
  onMoveEnd: (id: string, from: [number, number], to: [number, number]) => void
  onHandleDown: (node: string, handle: string) => void
  onHandleUp: (node: string, handle: string) => void
}

interface NodeWrapperState {
  id: string
  pos: [number, number]

}

interface Handle {
  id: string,
  position?: Position,
  ref: React.RefObject<HTMLDivElement>
}

export const NodeWrapper = memo(forwardRef(({ id, pos, scale, children, onMoveEnd, onMove, onHandleDown, onHandleUp }: NodeWrapperProperties, ref): JSX.Element => {
  let handles: Handle[] = []
  const originalPos = pos
  let currentPos = originalPos
  let currentScale = scale
  let dragPos = [0,0]
  let prevPos = currentPos
  const divRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    getState(): NodeWrapperState {
      return { id, pos: currentPos || pos }
    },
    getHandleInfo(id: string): HandleInfo {
      const handle = handles.find(h => h.id === id)
      const current = handle?.ref.current

      const x = (current?.offsetLeft || 0) + (current?.offsetWidth || 0) / 2 + currentPos[0]
      const y = (current?.offsetTop || 0) + (current?.offsetHeight || 0) / 2 + currentPos[1]      
      return { pos: [x, y], position: handle?.position }
      // return currentPos 
    },
    setScale(scale: number) { currentScale = scale },
    setPosition(pos: [number, number]) { changePosition(pos) },
    getAlert() {
      alert("getAlert from NodeWrapper")
    }
  }))

  function registerHandle(handleId: string, ref: React.RefObject<HTMLDivElement>, position: Position) {
    handles.push({ id: handleId, ref, position })
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
    prevPos = [data.x/currentScale - dragPos[0] , data.y/currentScale - dragPos[1]]
    // console.log (`Drag Start ${}`)
    e.stopPropagation()
  }

  function changePosition(pos: [number, number]) : void {
    currentPos = pos
    onMove(id, currentPos)
    if (divRef.current) {
      divRef.current.style.setProperty("left", `${currentPos[0]}px`)
      divRef.current.style.setProperty("top", `${currentPos[1]}px`)
    }
  }

  const onDrag: DraggableEventHandler = (e, data) => {
    changePosition([data.x/currentScale - dragPos[0] , data.y/currentScale - dragPos[1]])
    e.stopPropagation()
  }

  const onDragEnd: DraggableEventHandler = (e, data) => {
    onMoveEnd(id, prevPos, currentPos)
    e.stopPropagation()
  }


  return <DraggableCore onDrag={onDrag} onStop={onDragEnd} onStart={onStartDrag} >
    <div ref={divRef} style={{ position: "absolute", left: currentPos[0], top: currentPos[1], display: "inline-block" }}>
      <nodeContext.Provider value={{ registerHandle, onMouseDownHandle, onMouseUpHandle }}>
        {children}
      </nodeContext.Provider>
    </div>
  </DraggableCore>
}))

