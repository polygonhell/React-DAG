export function getTextSize(str: string, fontFamily?: string, fontsize?: number) : [number, number] {
  const text = document.createElement("span")
  document.body.appendChild(text)

  text.style.fontFamily = (fontFamily || "Droid Sans")
  text.style.fontSize = (fontsize || 16) + "px"
  text.style.height = 'auto'
  text.style.width = 'auto'
  text.style.position = 'absolute'
  text.style.whiteSpace = 'no-wrap'
  text.innerHTML = str

  const width = Math.ceil(text.clientWidth)
  const height = Math.ceil(text.clientHeight)
  document.body.removeChild(text)
  return [width, height]
}