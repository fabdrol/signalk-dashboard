import {
  SET_LOCAL_TIME,
  SET_UTC_TIME,
} from '../actions/const'

import moment from 'moment-timezone'

export default function timeReducer(state = {}, action) {
  const newState = { ...state }

  if (typeof newState.utc === 'undefined') {
    newState.utc = moment.tz('utc').toISOString()
  }

  if (typeof newState.local === 'undefined') {
    newState.local = moment.tz('Europe/Amsterdam').toISOString()
  }

  switch (action.type) {
    case SET_UTC_TIME:
      newState.utc = moment.tz('utc').toISOString()
      break

    case SET_LOCAL_TIME:
      newState.local = moment.tz('Europe/Amsterdam').toISOString()
      break
  }

  return newState
}
