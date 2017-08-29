import moment from 'moment-timezone'
import { SET_DEPTH } from '../actions/const'

export default function environmentReducer(state = {}, action) {
  const newState = { ...state }

  if (typeof newState.depth === 'undefined') {
    newState.depth = {
      value: 0.0,
      timestamp: moment.tz('UTC')
    }
  }

  switch (action.type) {
    case SET_DEPTH:
      newState.depth = action.payload
      break
  }

  return newState
}
