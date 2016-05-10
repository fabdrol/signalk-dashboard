export default {

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
  }

}
