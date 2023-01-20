import { UsersActionTypes } from "../action-types/users";


export interface AddGuestUserAction {
    type: UsersActionTypes.ADD_GUEST_USER,
    payload: string
}

export interface SetCursorCallbackAction {
    type: UsersActionTypes.SET_CURSOR_CALLBACK, 
    payload: (data: any) => void
}

export type UsersAction = AddGuestUserAction | SetCursorCallbackAction