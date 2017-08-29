import { SET_IDENTITY } from './const';

export default function action(mmsiOrUuid) {
  return {
    type: SET_IDENTITY,
    payload: mmsiOrUuid
  }
}
