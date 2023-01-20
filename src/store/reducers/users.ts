import { UsersActionTypes } from '../action-types/users';
import { UsersAction } from './../actions/users';


interface UsersState {
    users: string[],
    setCursor?: (data: any) => void
}

const initialState: UsersState = {
    users: []
}

export default (state: UsersState = initialState, action: UsersAction): UsersState => {
    switch (action.type) {
        case UsersActionTypes.ADD_GUEST_USER:
            return {...state, users: [...state.users, action.payload]}
        
        case UsersActionTypes.SET_CURSOR_CALLBACK:
            return {...state, setCursor: action.payload}
    
        default:
            return state
    }
}