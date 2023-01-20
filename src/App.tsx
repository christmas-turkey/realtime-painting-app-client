import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Canvas from './components/Canvas/Canvas';
import Sidebar from './components/Sidebar/Sidebar';
import { useActions } from './hooks/useActions';
import { useTypedSelector } from './hooks/useTypedSelector';
import socket from './socket';


function App() {
  const {roomId} = useParams()
  const {drawer} = useTypedSelector(state => state.canvas)
  const {setCursor} = useTypedSelector(state => state.users)
  const actions = useActions()

  useEffect(() => {
    socket.emit("USER_JOINT", roomId)

    socket.on("USER_JOINT", (socketId: string) => {
      actions.users.addGuestUser(socketId)
    })
  }, [])
  
  useEffect(() => {
    if (drawer) {
      socket.on("SEND_CONTENT", (content: string) => {
        const image = new Image
        image.src = content
        image.onload = () => {
          drawer.ctx.clearRect(0, 0, drawer.canvasElement.width, drawer.canvasElement.height)
          drawer.ctx.drawImage(image, 0, 0)
        }
      })
    }
  }, [drawer])

  return (
    <div className='app'>
      <Sidebar />
      <Canvas />
    </div>
  );
}

export default App;
