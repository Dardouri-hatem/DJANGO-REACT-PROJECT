import {combineReducers} from 'redux'
import account from './account'
import errors from './errors'
import product from "./product"

export default combineReducers({
    account,
    errors,
    product,
})