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
  edges: [],
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
