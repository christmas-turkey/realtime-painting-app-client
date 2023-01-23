import { DrawerParametersType } from './../../types/types';
import { CanvasActionTypes } from "../action-types/canvas";
import Drawer from "../../utils/Drawer";

export interface SetDrawerInstanceAction {
    type: CanvasActionTypes.SET_DRAWER_INSTANCE,
    payload: Drawer
}

export interface SetDrawerParametersAction {
    type: CanvasActionTypes.SET_DRAWER_PARAMETERS,
    payload: Partial<DrawerParametersType>
}

export type CanvasAction = SetDrawerInstanceAction | SetDrawerParametersAction