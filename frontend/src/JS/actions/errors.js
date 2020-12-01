
import {CLEAR_ERRORS,GET_ERRORS} from "../constants"

export const returnErrors=(payload)=>async dispatch=>{
    dispatch({
        type : GET_ERRORS,
        payload
    })
}

export const clearErrors=()=>async dispatch=>{
    dispatch({
        type : CLEAR_ERRORS
    })
}