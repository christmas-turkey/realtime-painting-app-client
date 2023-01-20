import socket from "../socket"

export interface EventListenerType {
    type: string
    listener: (e: MouseEvent) => void
}

export interface ShapeDataType {
    event: MouseEvent,
    initialPos: [number, number]
}

export interface ParametersType {
    fillColor: string, 
    strokeColor: string, 
    strokeWidth: number
}

export const defaultParameters: ParametersType = {
    fillColor: "#fff",
    strokeColor: "#000",
    strokeWidth: 1
}


class Drawer {
    canvasElement: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    eventListeners: EventListenerType[] = []
    parameters: ParametersType
    contentHistory: string[] = []


    constructor(canvasElement: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvasElement = canvasElement
        this.ctx = ctx
        this.parameters = defaultParameters
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

    createShape(drawShape: (shapeData: ShapeDataType) => void) {
        let initialPos: [number, number] | null = null
        let prevContent: HTMLImageElement = new Image

        this.clearEventListeners()

        this.pushEventListener({type: "mousedown", listener: (event) => {
            initialPos = [event.offsetX, event.offsetY]
            const dataUrl = this.canvasElement.toDataURL("image/png")
            prevContent.src = dataUrl
        }})

        this.pushEventListener({type: "mousemove", listener: (event) => {
            if (initialPos) {
                this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)

                if (prevContent.src) {
                    this.ctx.drawImage(prevContent, 0, 0)
                }

                this.ctx.beginPath()
                this.ctx.strokeStyle = this.parameters.strokeColor
                this.ctx.lineWidth = this.parameters.strokeWidth
                this.ctx.fillStyle = this.parameters.fillColor

                drawShape({
                    event,
                    initialPos,
                })

                this.ctx.fill()
                if (this.parameters.strokeWidth > 0) {
                    this.ctx.stroke()  
                } 

                socket.emit("SEND_CONTENT", this.canvasElement.toDataURL("image/png"))
            }
        }})

        this.pushEventListener({type: "mouseup", listener: () => {
            initialPos = null
            this.contentHistory.push(this.canvasElement.toDataURL("image/png"))
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

        this.pushEventListener({type: "mouseup", listener: e => {
            prevPos = null
            this.contentHistory.push(this.canvasElement.toDataURL("image/png"))
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
            
            let sizeX = Math.abs(event.offsetX - initialPos[0])
            let sizeY = Math.abs(event.offsetY - initialPos[1])
            const angle = (2 * Math.PI) / sides
            const rotation = ((sides-2)*Math.PI/sides) / 2
            console.log(rotation)
    
            if (event.shiftKey) {
                const minSize = Math.min(sizeX, sizeY)
                this.ctx.lineTo (initialPos[0] + minSize * Math.cos(rotation), initialPos[1] + minSize * Math.sin(rotation));
    
            } else {
                this.ctx.lineTo(initialPos[0] + sizeX * Math.cos(rotation), initialPos[1] + sizeY * Math.sin(rotation));
            }         
    
            for (let i=1; i<=sides; i++) {
                if (event.shiftKey) {
                    const minSize = Math.min(sizeX, sizeY)
                    this.ctx.lineTo (initialPos[0] + minSize * Math.cos(rotation + i*angle), initialPos[1] + minSize * Math.sin(rotation + i*angle));
    
                } else {
                    this.ctx.lineTo(initialPos[0] + sizeX * Math.cos(rotation + i*angle), initialPos[1] + sizeY * Math.sin(rotation + i*angle));
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
    }

    undo() {
        this.contentHistory.pop()
        const prevContent = this.contentHistory[this.contentHistory.length - 1]

        if (prevContent) {
            const image = new Image()
            image.src = prevContent
            image.onload = () => {
                this.clearCanvas()
                this.ctx.drawImage(image, 0, 0)
            }
        } else {
            this.clearCanvas()
        }
    } 
}

export default Drawer