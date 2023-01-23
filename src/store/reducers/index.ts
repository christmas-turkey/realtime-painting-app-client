import {combineReducers} from 'redux'
import canvas from "./canvas"

const reducers = combineReducers({canvas})

export type RootState = ReturnType<typeof reducers>
export default reducers