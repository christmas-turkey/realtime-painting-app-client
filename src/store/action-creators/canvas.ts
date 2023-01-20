import { ParametersType } from './../../utils/Drawer';
import { SetDrawerInstanceAction, SetDrawerParametersAction } from './../actions/canvas';
import Drawer from "../../utils/Drawer";
import { CanvasActionTypes } from '../action-types/canvas';


export const setDrawerInstance = (payload: Drawer): SetDrawerInstanceAction => {
    return {
        type: CanvasActionTypes.SET_DRAWER_INSTANCE,
        payload
    }
}

export const setDrawerParameters = (payload: Partial<ParametersType>): SetDrawerParametersAction => {
    return {
        type: CanvasActionTypes.SET_DRAWER_PARAMETERS,
        payload
    }
}