import React, { forwardRef, memo, MouseEventHandler, ReactNode, useImperativeHandle, useState } from "react"
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
  const [selected, setSelected] = useState(false)
  const currentPos = useRef(originalPos)
  const currentScale = useRef(scale)
  let dragPos = [0,0]
  let prevPos = currentPos.current
  let selectable = true
  const divRef = useRef<HTMLDivElement>(null)



  useImperativeHandle(ref, () => ({
    getState(): NodeWrapperState {
      return { id, pos: currentPos.current || pos }
    },
    getHandleInfo(id: string): HandleInfo {
      const handle = handles.find(h => h.id === id)
      const current = handle?.ref.current

      const x = (current?.offsetLeft || 0) + (current?.offsetWidth || 0) / 2 + currentPos.current[0]
      const y = (current?.offsetTop || 0) + (current?.offsetHeight || 0) / 2 + currentPos.current[1]      
      return { pos: [x, y], position: handle?.position }
      // return currentPos 
    },
    setScale(scale: number) { currentScale.current = scale },
    setPosition(pos: [number, number]) { changePosition(pos) },
    getAlert() {
      alert("getAlert from NodeWrapper")
    }
  }))

  function registerHandle(handleId: string, ref: React.RefObject<HTMLDivElement>, position: Position) {
    handles.push({ id: handleId, ref, position })
    // Handles can move when node is rerendered on selection change
    onMove(id, currentPos.current)
  }

  function onMouseDownHandle(handleId: string) {
    onHandleDown(id, handleId)
  }
  function onMouseUpHandle(handleId: string) {
    onHandleUp(id, handleId)
  }

  const onDragStart: DraggableEventHandler = (e, data) => {
    const scale = currentScale.current
    dragPos = [data.x/scale - currentPos.current[0], data.y/scale - currentPos.current[1]]
    prevPos = [data.x/scale - dragPos[0] , data.y/scale - dragPos[1]]
    // console.log (`Drag Start ${}`)
    e.stopPropagation()
  }

  function changePosition(pos: [number, number]) : void {
    currentPos.current = pos
    onMove(id, pos)
    if (divRef.current) {
      divRef.current.style.setProperty("left", `${pos[0]}px`)
      divRef.current.style.setProperty("top", `${pos[1]}px`)
    }
  }

  const onDrag: DraggableEventHandler = (e, data) => {
    const scale = currentScale.current
    changePosition([data.x/scale - dragPos[0] , data.y/scale - dragPos[1]])
    selectable = false
    e.stopPropagation()
  }

  const onDragEnd: DraggableEventHandler = (e, data) => {
    onMoveEnd(id, prevPos, currentPos.current)
    e.stopPropagation()
  }


  const onSelectNode: MouseEventHandler<HTMLDivElement> = (e) => {
    if(selectable) {
      console.log(`Node Selected - ${id}`)
      setSelected(!selected)
    }
    selectable = true
  }

  return <DraggableCore onDrag={onDrag} onStop={onDragEnd} onStart={onDragStart} >
    <div ref={divRef} style={{ position: "absolute", left: currentPos.current[0], top: currentPos.current[1], display: "inline-block" }} onClick={onSelectNode}>
      <nodeContext.Provider value={{ registerHandle, onMouseDownHandle, onMouseUpHandle, selected}}>
        {
          children
        }
      </nodeContext.Provider>
    </div>
  </DraggableCore>
}))

