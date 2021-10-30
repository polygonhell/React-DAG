import { Button } from '@material-ui/core'
import { useRef } from 'react';
import './App.css';
import { Graph, Elements } from './graph/Graph';
import { GraphRef } from './graph/types'


let nodeID = 7


const initialElements: Elements = {
  nodes: [
    {
      id:"1",
      position:[100,100],
      data: {
        label:"Test 1"
      }
    }, {
      id:"2",
      position:[200,100],
      data: {
        label:"Testing 2"
      }
    }, {
      id:"3",
      position:[300,100],
      data: {
        label:"Test 3"
      }
    }, {
      id:"4",
      position:[100,200],
      data: {
        label:"Test 4"
      }
    }
  ],
  edges: [
    {
      id: "1to2",
      from: {node: "1", handle: "output"},
      to: {node: "2", handle: "input"}
    },
    {
      id: "1to3",
      from: {node: "1", handle: "output"},
      to: {node: "3", handle: "input"}
    },
    {
      id: "2to4",
      from: {node: "2", handle: "output"},
      to: {node: "4", handle: "input"}
    },

  ],
}

function App() {
  const graphRef = useRef<GraphRef>()
  const newNode : React.MouseEventHandler<HTMLButtonElement> = (e) =>  {
    if (graphRef.current) {
      const gr = graphRef.current
      const ext = gr.getExtents()
      const newID = "_N_" + nodeID++
      gr.addNode({id: newID, position:[(ext.left+ext.right)/2, (ext.top + ext.bottom)/2], data:{label: "New Node"}})
    }
  }
  return (
    <div className="App" style={{display:"flex", flexDirection:"column"}}>
      <Graph elements={initialElements} style={{width: 1024, height: 600}} ref={graphRef}/>
      <div className="App" style={{display:"flex", flexDirection:"row"}}>
        <Button onClick={newNode} >NewNode</Button>
      </div>
    </div>
  );
}

export default App;
