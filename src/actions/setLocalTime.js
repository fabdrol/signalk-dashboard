import { SET_LOCAL_TIME } from './const';

export default function action(moment) {
  return {
    type: SET_LOCAL_TIME,
    payload: moment
  }
}
