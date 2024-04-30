import { combineReducers } from 'redux'
import loggedReducer from './loggedReducer'

const allReducers = combineReducers({
  logged: loggedReducer,
})

export default allReducers
