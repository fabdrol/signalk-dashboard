import { SET_IDENTITY } from '../actions/const'

export default function identityReducer(state = {}, action) {
  const newState = { ...state }

  if (typeof newState.self === 'undefined') {
    newState.self = ''
  }

  switch (action.type) {
    case SET_IDENTITY:
      newState.self = action.payload
      break
  }

  return newState
}
