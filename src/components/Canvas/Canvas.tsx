import {useRef, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { useActions } from '../../hooks/useActions'
import socket from '../../socket'
import Drawer from '../../utils/Drawer'
import Icon from "@ant-design/icons"
import {ReactComponent as CursorIcon} from "../../assets/cursor.svg"
import CanvasHeader from '../CanvasHeader/CanvasHeader'
import "./Canvas.scss"


interface CursorsType {
  [socketId: string]: [number, number]
}

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cursors, setCursors] = useState<CursorsType>({})
  const {roomId} = useParams()

  const actions = useActions()

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      const ctx = canvas.getContext("2d")

      if (ctx) {
        const drawer = new Drawer(canvas, ctx)
        actions.canvas.setDrawerInstance(drawer)

        canvas.addEventListener("mousemove", (e: MouseEvent) => {
          socket.emit("MOVE_MOUSE", {
            mousePos: [e.offsetX, e.offsetY],
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
    }

    socket.on("MOVE_MOUSE", ({socketId, mousePos}) => {
      setCursors(prev => {
        return  {...prev, [socketId]: mousePos}
      })
    })
  }, [])

  return (
    <div className='canvas-wrapper'>
      <CanvasHeader />
      {Object.values(cursors).map(cursorPos => (
        <Icon
          component={CursorIcon}
          style={{
            left: cursorPos[0] + "px",
            top: cursorPos[1] + "px"
          }} 
          className='canvas-wrapper__cursor' />
      ))}
      <canvas ref={canvasRef} className='canvas' />
    </div>
  )
}

export default Canvas