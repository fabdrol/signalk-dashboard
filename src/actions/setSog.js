import { SET_SOG } from './const';

export default function action(speedOverGround) {
  return {
    type: SET_SOG,
    payload: speedOverGround
  }
}
