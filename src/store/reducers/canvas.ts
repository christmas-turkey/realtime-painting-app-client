import { DrawerParametersType } from './../../types/types';
import { defaultParameters } from './../../utils/Drawer';
import { CanvasAction } from './../actions/canvas';
import Drawer from "../../utils/Drawer"
import { CanvasActionTypes } from '../action-types/canvas';

export interface CanvasState {
    drawer: Drawer | null,
    parameters: DrawerParametersType
}

const initialState: CanvasState = {
    drawer: null,
    parameters: defaultParameters
}

export default (state: CanvasState = initialState, action: CanvasAction): CanvasState => {
    switch (action.type) {
        case CanvasActionTypes.SET_DRAWER_INSTANCE:
            return {...state, drawer: action.payload}
        
        case CanvasActionTypes.SET_DRAWER_PARAMETERS:
            const parameters = {...state.parameters, ...action.payload}
            if (state.drawer) {
                state.drawer.parameters = parameters
            }
            return {...state, parameters}
    
        default:
            return state
    }
}