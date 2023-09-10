import { Button } from '@chakra-ui/react';
import {Route,Routes} from 'react-router-dom';
import './App.css';
import Home from './components/home/Home.js';
import Chat from './components/chat/Chat.js';
function App() {
  return (
    <div className="App">
      {/* <Routes> */}
      <Route exact path="/" component={Home} />
      <Route exact path="/chat" component={Chat}/>
      {/* </Routes> */}

      {/* This is React App
      <Button colorScheme='teal'>Button</Button> */}
      
    </div>
  );
}

export default App;
