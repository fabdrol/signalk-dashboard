import { SET_STW } from './const';

export default function action(speedThroughWater) {
  return {
    type: SET_STW,
    payload: speedThroughWater
  }
}
