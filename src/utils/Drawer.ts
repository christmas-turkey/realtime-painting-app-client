import { DrawerParametersType } from './../types/types';
import socket from "../core/socket"


export interface EventListenerType {
    type: string
    listener: (e: MouseEvent) => void
}

export interface ShapeDataType {
    event: MouseEvent,
    initialPos: [number, number]
}

export const defaultParameters: DrawerParametersType = {
    fillColor: "#fff",
    strokeColor: "#000",
    strokeWidth: 1
}


class Drawer {
    canvasElement: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    eventListeners: EventListenerType[] = []
    contentHistory: string[] = []
    parameters: DrawerParametersType = defaultParameters
    roomId: string


    constructor(canvasElement: HTMLCanvasElement, roomId: string) {
        this.canvasElement = canvasElement
        this.ctx = canvasElement.getContext("2d")!
        this.roomId = roomId
    }

    pushEventListener(eventListener: EventListenerType) {
        this.canvasElement.addEventListener(eventListener.type, eventListener.listener as EventListener)
        this.eventListeners.push(eventListener)
    }

    clearEventListeners() {
        this.eventListeners.forEach(eventListener => {
            this.canvasElement.removeEventListener(eventListener.type, eventListener.listener  as EventListener)
        })
        this.eventListeners = []
    }

    drawContent(content: string) {
        const image = new Image()
        image.src = content
        image.onload = () => {
            this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
            this.ctx.drawImage(image, 0, 0)
        }
    }

    createShape(drawShape: (shapeData: ShapeDataType) => void) {
        let initialPos: [number, number] | null = null
        let prevContentImage: HTMLImageElement = new Image()

        this.clearEventListeners()

        this.pushEventListener({type: "mousedown", listener: (event) => {
            initialPos = [event.offsetX, event.offsetY]
            prevContentImage.src = this.canvasElement.toDataURL()
        }})

        this.pushEventListener({type: "mousemove", listener: (event) => {
            if (initialPos) {
                if (prevContentImage) {
                    this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
                    this.ctx.drawImage(prevContentImage, 0, 0)
                }

                this.ctx.beginPath()
                this.ctx.strokeStyle = this.parameters.strokeColor
                this.ctx.lineWidth = this.parameters.strokeWidth
                this.ctx.fillStyle = this.parameters.fillColor

                drawShape({event, initialPos})

                this.ctx.fill()
                if (this.parameters.strokeWidth > 0) {
                    this.ctx.stroke()  
                }
                
                socket.emit("UPDATE_CANVAS_CONTENT", {
                    contentHistory: this.contentHistory,
                    content: this.canvasElement.toDataURL(),
                    roomId: this.roomId
                })
            }
        }})

        this.pushEventListener({type: "mouseup", listener: () => {
            initialPos = null
            this.contentHistory.push(this.canvasElement.toDataURL())

            socket.emit("UPDATE_CANVAS_CONTENT", {
                contentHistory: this.contentHistory,
                content: this.canvasElement.toDataURL(),
                roomId: this.roomId
            })
        }})
    }

    brush() {
        let prevPos: [number, number] | null = null

        const drawCircle = (posX: number, posY: number) => {
            this.ctx.fillStyle = this.parameters.strokeColor
            this.ctx.beginPath()
            this.ctx.arc(posX, posY, this.parameters.strokeWidth/2, 0, 2*Math.PI)
            this.ctx.fill()
        }

        this.clearEventListeners()

        this.pushEventListener({type: "mousedown", listener: event => {
            drawCircle(event.offsetX, event.offsetY)
            prevPos = [event.offsetX, event.offsetY]
        }})

        this.pushEventListener({type: "mouseup", listener: () => {
            prevPos = null
            this.contentHistory.push(this.canvasElement.toDataURL())

            socket.emit("UPDATE_CANVAS_CONTENT", {
                contentHistory: this.contentHistory,
                content: this.canvasElement.toDataURL(),
                roomId: this.roomId
            })
        }})

        this.pushEventListener({type: "mousemove", listener: event => {
            if (prevPos) {
                drawCircle(event.offsetX, event.offsetY)
    
                this.ctx.beginPath()
                this.ctx.lineWidth = this.parameters.strokeWidth
                this.ctx.moveTo(prevPos[0], prevPos[1])
                this.ctx.lineTo(event.offsetX, event.offsetY)
                this.ctx.strokeStyle = this.parameters.strokeColor
                this.ctx.stroke()
    
                prevPos = [event.offsetX, event.offsetY]

                socket.emit("UPDATE_CANVAS_CONTENT", {
                    contentHistory: this.contentHistory,
                    content: this.canvasElement.toDataURL(),
                    roomId: this.roomId
                })
            }
        }})
    }

    ellipse() {
        this.createShape(({event, initialPos}) => {
            if (event.shiftKey) {
                const minSide = Math.min(event.offsetX-initialPos[0], event.offsetY-initialPos[1])
                this.ctx.ellipse(initialPos[0], initialPos[1], Math.abs(minSide), Math.abs(minSide), 0, 0, 2*Math.PI)

            } else {
                this.ctx.ellipse(initialPos[0], initialPos[1], Math.abs(event.offsetX-initialPos[0]), Math.abs(event.offsetY-initialPos[1]), 0, 0, 2*Math.PI)
            }
        })
    }

    polygon(sides: number) {
        this.createShape(({event, initialPos}) => {
            
            let radiusX = Math.abs(event.offsetX - initialPos[0])
            let radiusY = Math.abs(event.offsetY - initialPos[1])
            const angle = (2 * Math.PI) / sides
            const rotation = ((sides-2)*Math.PI/sides) / 2
    
            if (event.shiftKey) {
                const minSize = Math.min(radiusX, radiusY)
                this.ctx.lineTo (initialPos[0] + minSize * Math.cos(rotation), initialPos[1] + minSize * Math.sin(rotation));
    
            } else {
                this.ctx.lineTo(initialPos[0] + radiusX * Math.cos(rotation), initialPos[1] + radiusY * Math.sin(rotation));
            }         
    
            for (let i=1; i<=sides; i++) {
                if (event.shiftKey) {
                    const minSize = Math.min(radiusX, radiusY)
                    this.ctx.lineTo (initialPos[0] + minSize * Math.cos(rotation + i*angle), initialPos[1] + minSize * Math.sin(rotation + i*angle));
    
                } else {
                    this.ctx.lineTo(initialPos[0] + radiusX * Math.cos(rotation + i*angle), initialPos[1] + radiusY * Math.sin(rotation + i*angle));
                }
            }

            this.ctx.closePath()
        })
    }

    line() {
        this.createShape(({event, initialPos}: ShapeDataType) => {
            this.ctx.moveTo(initialPos[0], initialPos[1])

            if (event.shiftKey) {
                if (Math.abs(event.offsetX - initialPos[0]) < Math.abs(event.offsetY - initialPos[1])) {
                    this.ctx.lineTo(initialPos[0], event.offsetY)
                } else {
                    this.ctx.lineTo(event.offsetX, initialPos[1])
                }
            } else {
                this.ctx.lineTo(event.offsetX, event.offsetY)
            }
        })
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
        socket.emit("CLEAR_CANVAS", {
            roomId: this.roomId
        })
    }

    undo() {
        this.contentHistory.pop()
        const prevContent = this.contentHistory[this.contentHistory.length - 1]

        if (prevContent) {
            this.drawContent(prevContent)
            socket.emit("UPDATE_CANVAS_CONTENT", {
                contentHistory: this.contentHistory,
                content: this.canvasElement.toDataURL(),
                roomId: this.roomId
            })
        } else {
            this.clearCanvas()
        }
    } 
}

export default Drawer