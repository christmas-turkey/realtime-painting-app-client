import { ParametersType } from './../../utils/Drawer';
import { CanvasActionTypes } from "../action-types/canvas";
import Drawer from "../../utils/Drawer";

export interface SetDrawerInstanceAction {
    type: CanvasActionTypes.SET_DRAWER_INSTANCE,
    payload: Drawer
}

export interface SetDrawerParametersAction {
    type: CanvasActionTypes.SET_DRAWER_PARAMETERS,
    payload: Partial<ParametersType>
}

export type CanvasAction = SetDrawerInstanceAction | SetDrawerParametersAction