import { combineReducers } from 'redux'
import navigation from './navigation'
import environment from './environment'
import identity from './identity'
import time from './time'

const reducers = {
  navigation,
  environment,
  identity,
  time,
}

export default combineReducers(reducers)
