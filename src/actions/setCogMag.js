import { SET_COG_MAG } from './const';

export default function action(courseOverGroundMagnetic) {
  return {
    type: SET_COG_MAG,
    payload: courseOverGroundMagnetic
  }
}
