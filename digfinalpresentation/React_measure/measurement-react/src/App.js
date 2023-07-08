import './App.css';
import { Switch } from "@mui/material";
import Header from './components/Header/Header';
import Canvas from './components/Canvas/Canvas';

function App() {
  return (
    <div
      className="App-compornent"
    >
      {/* <Switch /> */}
      < Header />
      <Canvas />
    </div >
  );
}

export default App;
