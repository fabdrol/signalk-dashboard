<template>
  <div :class="{'widget': true, 'blurred': overlayIsActive}" @click="toggleOverlay">
    <h3 class="title">Longitude/latitude</h3>
    <h2 class="value">{{ longitude }}</h2>
    <h2 class="value">{{ latitude }}</h2>
  </div>

  <overlay v-if="overlayIsActive" transition="fade">
    <div class="calculate-distance-form">
      <div class="form-group group-longitude">
        <label>Longitude</label>
        <input class="form-input degrees" type="text" name="form.longitude.degrees" v-model="form.longitude.degrees" placeholder="5°">
        <input class="form-input minutes" type="text" name="form.longitude.minutes" v-model="form.longitude.minutes" placeholder="26'">
        <input class="form-input seconds" type="text" name="form.longitude.seconds" v-model="form.longitude.seconds" placeholder="14.9''">
      </div>

      <div class="form-group group-latitude">
        <label>Latitude</label>
        <input class="form-input degrees" type="text" name="form.latitude.degrees" v-model="form.latitude.degrees" placeholder="5°">
        <input class="form-input minutes" type="text" name="form.latitude.minutes" v-model="form.latitude.minutes" placeholder="26'">
        <input class="form-input seconds" type="text" name="form.latitude.seconds" v-model="form.latitude.seconds" placeholder="14.9''">
      </div>

      <div class="form-button" @click="calculate">Bereken</div>
      <div class="form-button form-button-white" @click="toggleOverlay">Sluiten</div>

      <div class="widget" v-if="form.calculated.distance > -1" transition="fade">
        <h3 class="title">Afstand (great circle)</h3>
        <h2 class="value">{{ form.calculated.distance }} nm</h2>
        <br>
        <h3 class="title">Richting</h3>
        <h2 class="value">{{ form.calculated.bearingLabel }} {{ form.calculated.bearing }}°</h2>
      </div>
    </div>
  </overlay>
</template>

<script>
  export default {
    props: ['data'],

    data () {
      return {
        overlayIsActive: false,
        form: {
          calculated: {
            distance: -1,
            bearing: -1,
            bearingLabel: ''
          },

          latitude: {
            degrees: '',
            minutes: '',
            seconds: ''
          },

          longitude: {
            degrees: '',
            minutes: '',
            seconds: ''
          }
        }
      }
    },

    methods: {
      toggleOverlay () {
        this.overlayIsActive = !this.overlayIsActive
      },

      calculate () {
        let lat = {
          degrees: parseFloat(this.form.latitude.degrees),
          minutes: parseFloat(this.form.latitude.minutes),
          seconds: parseFloat(this.form.latitude.seconds)
        }

        let lng = {
          degrees: parseFloat(this.form.longitude.degrees),
          minutes: parseFloat(this.form.longitude.minutes),
          seconds: parseFloat(this.form.longitude.seconds)
        }

        if (isNaN(lat.degrees) || isNaN(lat.minutes) || isNaN(lng.degrees) || isNaN(lng.minutes)) {
          return
        }

        if (isNaN(lat.seconds)) {
          lat.seconds = 0
        }

        if (isNaN(lng.seconds)) {
          lng.seconds = 0
        }

        let self = {
          lat: this.data.latitude,
          lng: this.data.longitude
        }

        let point = {
          lat: dmsToDd('N', lat),
          lng: dmsToDd('E', lng)
        }

        this.form.calculated.distance = (distance(self, point) * 0.000539957).toFixed(2)
        this.form.calculated.bearing = heading(self, point).toFixed(2)
      }
    },

    computed: {
      longitude () {
        return ddToDms('longitude', this.data.longitude || 0.0)
      },

      latitude () {
        return ddToDms('latitude', this.data.latitude || -0.0)
      }
    }
  }

  function heading (pointA, pointB) {
    const latA = toRadians(pointA.lat)
    const lngA = toRadians(pointA.lng)
    const latB = toRadians(pointB.lat)
    const lngB = toRadians(pointB.lng)
    const dLng = lngB - lngA

    const x = Math.sin(dLng) * Math.cos(latB)
    const y = Math.cos(latA) * Math.sin(latB) - Math.sin(latA) * Math.cos(latB) * Math.cos(dLng)

    let bearing = toDegrees(Math.atan2(y, x))
    bearing = (bearing + 360) % 360
    bearing = 360 - bearing

    return bearing
  }

  function distance (pointA, pointB) {
    const R = 6371000
    const latA = toRadians(pointA.lat)
    const latB = toRadians(pointB.lat)
    const deltaLat = toRadians(pointB.lat - pointA.lat)
    const deltaLng = toRadians(pointB.lng - pointA.lng)

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(latA) * Math.cos(latB) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  function toRadians (deg) {
    return deg * (Math.PI / 180)
  }

  function toDegrees (rad) {
    return (180 / Math.PI) * rad
  }

  function dmsToDd (pole, data) {
    let minsec = data.minutes

    if (data.seconds > 0) {
      minsec += (data.seconds / 60)
    }

    let decimal = data.degrees + (minsec / 60)

    if (pole.toUpperCase() === 'S' || pole.toUpperCase() === 'W') {
      decimal *= -1
    }

    return decimal
  }

  function ddToDms (type, deg, precision = 6) {
    let dd = Math.abs(deg)
    let d = Math.floor(dd)
    let m = (dd - d) * 60
    let S = ''

    if (type === 'longitude' && deg < 0) {
      S = 'W'
    }

    if (type === 'longitude' && deg >= 0) {
      S = 'E'
    }

    if (type === 'latitude' && deg < 0) {
      S = 'S'
    }

    if (type === 'latitude' && deg >= 0) {
      S = 'N'
    }

    return `${d}° ${m.toFixed(precision)}' ${S}`
  }
</script>

<style lang="stylus">
  dark-blue = #2C3E50 // rgb(44, 62, 80)
  bright-red = #FC4349 // rgb(252, 67, 73)
  medium-grey = #D7DADB // rgb(215, 218, 219)
  light-blue = #6DBCDB // rgb(109, 188, 219)
  white = #FFFFFF // rgb(255, 255, 255)

  .form-button
    display block
    width 100%
    height 50px
    line-height 47px
    border-radius 5px
    margin 2em 0
    text-transform uppercase
    background-color bright-red
    border 1px solid darken(bright-red, 30%)
    border-bottom-width 4px
    color white

    &.form-button-white
      background-color white
      border-color darken(white, 30%)
      color bright-red

    &:active
      border-bottom-width 1px
      line-height 50px

  .form-group
    display block
    width 100%
    height 100px
    overflow hidden
    margin-bottom 1em
    text-align center

    label
      display block
      font-weight normal
      font-size .9em
      height 30px
      line-height 30px
      text-align center
      text-transform uppercase
      color bright-red

    .form-input
      display inline-block
      width 30%
      height 70px
      padding .5em
      font-size 1.5em
      border none
      outline none
      border-radius 5px
      appearance none
</style>
