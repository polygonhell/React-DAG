import { useRef } from 'react';
import './App.css';
import { Graph, Elements } from './graph/Graph';



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
  const graphRef = useRef()
  return (
    <div className="App">
      <Graph elements={initialElements} ref={graphRef}/>
    </div>
  );
}

export default App;
