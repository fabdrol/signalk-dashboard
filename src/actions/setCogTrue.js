import { SET_COG_TRUE } from './const';

export default function action(courseOverGroundTrue) {
  return {
    type: SET_COG_TRUE,
    payload: courseOverGroundTrue
  }
}
