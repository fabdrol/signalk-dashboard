import moment from 'moment-timezone'

import {
  SET_POSITION,
  SET_COG_TRUE,
  SET_COG_MAG,
  SET_SOG,
  SET_STW,
} from '../actions/const'

export default function navigationReducer(state = {}, action) {
  const newState = { ...state }

  if (typeof newState.position === 'undefined') {
    newState.position = {
      longitude: 0.0,
      latitude: 0.0,
      altitude: 0.0,
      timestamp: moment.tz('UTC')
    }
  }

  if (typeof newState.cogTrue === 'undefined') {
    newState.cogTrue = {
      value: 0.0,
      timestamp: moment.tz('UTC')
    }
  }

  if (typeof newState.cogMag === 'undefined') {
    newState.cogMag = {
      value: 0.0,
      timestamp: moment.tz('UTC')
    }
  }

  if (typeof newState.sog === 'undefined') {
    newState.sog = {
      value: 0.0,
      timestamp: moment.tz('UTC')
    }
  }

  if (typeof newState.stw === 'undefined') {
    newState.stw = {
      value: 0.0,
      timestamp: moment.tz('UTC')
    }
  }

  switch (action.type) {
    case SET_POSITION:
      newState.position.longitude = action.payload.longitude || 0.0
      newState.position.latitude = action.payload.latitude || 0.0
      newState.position.altitude = action.payload.altitude || 0.0
      newState.position.timestamp = moment.tz(action.payload.timestamp, 'UTC')
      break

    case SET_COG_TRUE:
      newState.cogTrue.value = action.payload.value
      newState.cogTrue.timestamp = moment.tz(action.payload.timestamp, 'UTC')
      break

    case SET_COG_MAG:
      newState.cogMag.value = action.payload.value
      newState.cogMag.timestamp = moment.tz(action.payload.timestamp, 'UTC')
      break

    case SET_SOG:
      newState.sog.value = action.payload.value
      newState.sog.timestamp = moment.tz(action.payload.timestamp, 'UTC')
      break

    case SET_STW:
      newState.stw.value = action.payload.value
      newState.stw.timestamp = moment.tz(action.payload.timestamp, 'UTC')
      break
  }

  return newState
}
