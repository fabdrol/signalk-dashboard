import { SET_POSITION } from './const';

export default function action(position) {
  return {
    type: SET_POSITION,
    payload: position
  }
}
