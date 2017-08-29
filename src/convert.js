import config from 'config'
const labels = config.labels[config.language]

function toDegreesMinutesAndSeconds(coordinate) {
  const absolute = Math.abs(coordinate)
  const degrees = Math.floor(absolute)
  const minutesNotTruncated = (absolute - degrees) * 60
  const minutes = minutesNotTruncated.toFixed(3)
  return `${degrees}' ${minutes}"`
}

export default {
  latitude (lat) {
    const latitude = toDegreesMinutesAndSeconds(lat)
    const latitudeCardinal = Math.sign(lat) >= 0 ? labels.north : labels.south
    return `${latitude} ${latitudeCardinal}`
  },

  longitude (lng) {
    const longitude = toDegreesMinutesAndSeconds(lng)
    const longitudeCardinal = Math.sign(lng) >= 0 ? labels.east : labels.west
    return `${longitude} ${longitudeCardinal}`
  },

  speed (value, input = 'm/s', output = 'kts') {
    input = input.toLowerCase()
    output = output.toLowerCase()
    const precision = String(value).indexOf('.') !== -1 ? String(value).split('.')[1].length : 0

    if (input === 'm/s' && output === 'kts') {
      return parseFloat((value * 1.94384).toFixed(precision))
    }

    return value
  },

  angle (value, input = 'rad', output = 'deg') {
    input = input.toLowerCase()
    output = output.toLowerCase()
    const precision = String(value).indexOf('.') !== -1 ? String(value).split('.')[1].length : 0

    if (input === 'rad' && output === 'deg') {
      return parseFloat((value * (180 / Math.PI)).toFixed(precision))
    }

    if (input === 'deg' && output === 'rad') {
      return parseFloat((value * (Math.PI / 180)).toFixed(precision))
    }

    return value
  },
}
