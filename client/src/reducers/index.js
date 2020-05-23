import {combineReducers} from 'redux'
import errorReducer from './errorReducer'
import homeReducer from './homeReducer'


import googleInfoReducer from './googleInfoReducer'

export default combineReducers({
  auth: googleInfoReducer,
  errors: errorReducer,
  home: homeReducer,
})