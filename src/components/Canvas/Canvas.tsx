import {useRef, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { useActions } from '../../hooks/useActions'
import socket from '../../core/socket'
import Drawer from '../../utils/Drawer'
import Icon from "@ant-design/icons"
import {ReactComponent as CursorIcon} from "../../assets/cursor.svg"
import CanvasHeader from '../CanvasHeader/CanvasHeader'
import {UsersType} from "../../types/types"
import "./Canvas.scss"


const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [users, setUsers] = useState<UsersType>({})
  const {roomId} = useParams()

  const actions = useActions()

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight

      const drawer = new Drawer(canvas, roomId!)
      actions.canvas.setDrawerInstance(drawer)

      socket.on("UPDATE_CANVAS_CONTENT", ({content, contentHistory}) => {
        drawer.drawContent(content)
        drawer.contentHistory = contentHistory
      })

      socket.on("CLEAR_CANVAS", () => {
        drawer.contentHistory = []
        drawer.ctx.clearRect(0, 0, canvas.width, canvas.height)
      })

      socket.on("MOVE_CURSOR", (users: UsersType) => {
        setUsers(users)
      })

      socket.on("USER_LEFT", (users: UsersType) => {
        setUsers(users)
      })

      canvas.addEventListener("mousemove", (e: MouseEvent) => {
        socket.emit("MOVE_CURSOR", {
          cursorPos: [e.clientX, e.clientY],
          roomId
        })
      })

      document.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key == "z") {
          drawer.undo()
        } else if (e.ctrlKey && e.key == "x") {
          drawer.clearCanvas()
        }
      })
    }
  }, [])

  return (
    <div className='canvas-wrapper'>
      <CanvasHeader />
      {Object.entries(users).map(([socketId, {cursorPos}]) => (
        (socketId !== socket.id) && (
          <Icon
            component={CursorIcon}
            style={{
              left: cursorPos[0] + "px",
              top: cursorPos[1] + "px"
            }} 
            className='canvas-wrapper__cursor' />
        )
      ))}
      <canvas ref={canvasRef} className='canvas-wrapper__canvas' />
    </div>
  )
}

export default Canvas