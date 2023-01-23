import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Canvas from './components/Canvas/Canvas';
import Sidebar from './components/Sidebar/Sidebar';
import socket from './core/socket';


function App() {
  const {roomId} = useParams()

  useEffect(() => {
    socket.emit("USER_JOINT", roomId)
  }, [])

  return (
    <div className='app'>
      <Sidebar />
      <Canvas />
    </div>
  );
}

export default App;
