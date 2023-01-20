import {combineReducers} from 'redux'
import canvas from "./canvas"
import users from "./users"

const reducers = combineReducers({canvas, users})

export type RootState = ReturnType<typeof reducers>
export default reducers