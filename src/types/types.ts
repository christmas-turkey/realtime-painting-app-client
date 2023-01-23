export interface UsersType {
    [socketId: string]: {
        cursorPos: [number, number]
    }
}

export interface DrawerParametersType {
    fillColor: string, 
    strokeColor: string, 
    strokeWidth: number
}