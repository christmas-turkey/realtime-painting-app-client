import {bindActionCreators} from 'redux'
import {useDispatch} from 'react-redux'
import * as canvasActions from "../store/action-creators/canvas" 


export const useActions = () => {
    const dispatch = useDispatch()

    return {
        canvas: bindActionCreators(canvasActions, dispatch)
    }
}