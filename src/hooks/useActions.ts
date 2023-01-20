import {bindActionCreators} from 'redux'
import {useDispatch} from 'react-redux'
import * as canvasActions from "../store/action-creators/canvas" 
import * as usersActions from "../store/action-creators/users" 


export const useActions = () => {
    const dispatch = useDispatch()

    return {
        canvas: bindActionCreators(canvasActions, dispatch),
        users: bindActionCreators(usersActions, dispatch)
    }
}