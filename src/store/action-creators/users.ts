import { UsersActionTypes } from '../action-types/users';
import { AddGuestUserAction, SetCursorCallbackAction } from './../actions/users';


export const addGuestUser = (payload: string): AddGuestUserAction => {
    return {
        type: UsersActionTypes.ADD_GUEST_USER,
        payload
    }
}

export const setCursorCallback = (payload: (data: any) => void): SetCursorCallbackAction => {
    return {
        type: UsersActionTypes.SET_CURSOR_CALLBACK,
        payload
    }
}