import { SET_DEPTH } from './const';

export default function action(belowTransducer) {
  return {
    type: SET_DEPTH,
    payload: belowTransducer
  }
}
