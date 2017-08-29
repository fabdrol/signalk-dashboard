import SignalK from 'signalk-client'
import moment from 'moment'
import config from 'config'
import actions from './actions'

export default function (store) {
  const signalk = new SignalK.Client(config.host, config.port)
  const isObject = (mixed) => (typeof mixed === 'object' && mixed !== null)
  const dispatch = store.dispatch
  let lastUpdate = Date.now()

  signalk
  .getSelf()
  .then(response => {
    const data = response.body
    let identity = null

    if (typeof data.uuid === 'string' && typeof data.mmsi === 'undefined') {
      dispatch(actions.setIdentity(data.uuid))
      identity = data.uuid
    }

    if (typeof data.mmsi === 'string' && typeof data.uuid === 'undefined') {
      dispatch(actions.setIdentity(data.mmsi))
      identity = data.mmsi
    }

    if (isObject(data.environment)) {
      const environment = data.environment

      if (isObject(environment.depth) && isObject(environment.depth.belowTransducer)) {
        dispatch(actions.setDepth(environment.depth.belowTransducer))
      }
    }

    if (isObject(data.navigation)) {
      const navigation = data.navigation

      if (isObject(navigation.position)) {
        dispatch(actions.setPosition(navigation.position))
      }

      if (isObject(navigation.speedOverGround)) {
        dispatch(actions.setSog(navigation.speedOverGround))
      }

      if (isObject(navigation.courseOverGroundTrue)) {
        dispatch(actions.setCogTrue(navigation.courseOverGroundTrue))
      }

      if (isObject(navigation.courseOverGroundMagnetic)) {
        dispatch(actions.setCogMag(navigation.courseOverGroundMagnetic))
      }

      if (isObject(navigation.speedThroughWater)) {
        dispatch(actions.setStw(navigation.speedThroughWater))
      }
    }

    lastUpdate = Date.now()
    return identity
  })
  .then(identity => {
    let logged = 0
    signalk.connectDelta(`${config.host}:${config.port}`, delta => {
      if (typeof delta.context === 'undefined') {
        return
      }

      const context = delta.context.replace('vessels.', '')
      const updates = delta.updates

      if ((context !== 'self' && context !== identity) || !Array.isArray(updates) || updates.length === 0) {
        return
      }

      updates.forEach(update => {
        if (!Array.isArray(update.values) || update.values.length === 0) {
          return
        }

        update.values.forEach(mutation => {
          if (mutation.path.indexOf('courseOverGroundMagnetic') !== -1) {
            dispatch(actions.setCogMag({
              timestamp: moment.tz('utc'),
              value: mutation.value
            }))
          }

          if (mutation.path.indexOf('courseOverGroundTrue') !== -1) {
            dispatch(actions.setCogTrue({
              timestamp: moment.tz('utc'),
              value: mutation.value
            }))
          }

          if (mutation.path.indexOf('speedOverGround') !== -1) {
            dispatch(actions.setSog({
              timestamp: moment.tz('utc'),
              value: mutation.value
            }))
          }

          if (mutation.path.indexOf('speedThroughWater') !== -1) {
            dispatch(actions.setStw({
              timestamp: moment.tz('utc'),
              value: mutation.value
            }))
          }

          if (mutation.path.indexOf('belowTransducer') !== -1) {
            dispatch(actions.setDepth({
              timestamp: moment.tz('utc'),
              value: mutation.value
            }))
          }

          if (mutation.path.indexOf('position') !== -1) {
            dispatch(actions.setPosition({
              timestamp: moment.tz('utc'),
              longitude: mutation.value.longitude,
              latitude: mutation.value.latitude,
            }))
          }
        })
      })

      lastUpdate = Date.now()
    })

    setInterval(() => {
      if ((Date.now() - lastUpdate) >= 60000) {
        window.location.href = window.location.href
      }
    }, 90000)
  })
  .catch(err => {
    console.log(`Error loading self: ${err.message}`)
  })

  return signalk
}
