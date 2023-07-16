import './App.css';
import { Switch } from "@mui/material";
import Header from './components/Header/Header';
import Canvas from './components/Canvas/Canvas';
import Setting from './components/Setting/Setting';
import { useSelector } from 'react-redux';

function App() {

  const { settingPage } = useSelector((state) => state.controller);


  return (
    <>
      <div
        className="App-compornent"
        style={{
          position: 'fixed',
          right: settingPage ? "270px" : 0,
          top: 0,
        }}
      >
        < Header />
        <Canvas />
      </div >
      <Setting />
    </>
  );
}

export default App;
