import { MouseEventHandler, ReactNode, useContext, useEffect, useRef } from "react"
import { nodeContext } from "./contexts"



interface HandleProps {
  id: string
  children?: ReactNode
  style?: React.CSSProperties
}


const defaultContents = <div style={{width:3, height:3, borderStyle:"solid", borderColor:"grey", borderWidth:3, borderRadius:6 }}></div>

export const Handle = ({id, style} : HandleProps) : JSX.Element => {
  const context = useContext(nodeContext)
  const contentsRef = useRef<HTMLDivElement>(null)

  const onmousedown : MouseEventHandler<HTMLDivElement> = e => {
    e.stopPropagation();
    context.onMouseDownHandle(id)
  }

  

  useEffect(() => {
    context.registerHandle(id)
  }, [id, context])

  useEffect(() => {
    console.log(`??? = ${JSON.stringify(contentsRef.current?.getClientRects())}`)
  }, [])
  
  return <div style={{ display: "inline-block", position: style?.position, left: style?.left, top: style?.top, right:style?.right, bottom:style?.bottom }} ref={contentsRef} onMouseDown={onmousedown}>
    {defaultContents}
  </div>
}