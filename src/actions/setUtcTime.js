import { SET_UTC_TIME } from './const';

export default function action(moment) {
  return {
    type: SET_UTC_TIME,
    payload: moment
  }
}
