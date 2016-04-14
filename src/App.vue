<template>
  <main id="app">
    <section class="dashboard">
      <speed :data="self.navigation.speedOverGround" type="speedOverGround" v-if="(typeof self === 'object' && typeof self.navigation === 'object' && typeof self.navigation.speedOverGround !== 'undefined')"></speed>
      <speed :data="self.navigation.speedThroughWater" type="speedThroughWater" v-if="(typeof self === 'object' && typeof self.navigation === 'object' && typeof self.navigation.speedThroughWater !== 'undefined')"></speed>
      <course-over-ground :data="self.navigation.courseOverGroundTrue" type="true" v-if="(typeof self === 'object' && typeof self.navigation === 'object' && typeof self.navigation.courseOverGroundTrue !== 'undefined')"></course-over-ground>
      <position :data="self.navigation.position" v-if="(typeof self === 'object' && typeof self.navigation === 'object' && typeof self.navigation.position !== 'undefined')"></position>
      <depth :data="self.environment.depth" v-if="(typeof self === 'object' && typeof self.environment === 'object' && typeof self.environment.depth !== 'undefined')"></depth>
    </section>
  </main>
</template>

<script>
  import position from './widgets/position'
  import depth from './widgets/depth'
  import courseOverGround from './widgets/courseOverGround'
  import speed from './widgets/speed'
  import time from './widgets/time'

  export default {
    components: {
      'position': position,
      'courseOverGround': courseOverGround,
      'speed': speed,
      'depth': depth,
      'time': time
    },

    data () {
      return {
        me: '',
        self: {},
        server: {},
        vessels: {},
        interval: null
      }
    },

    methods: {
      update (delta) {
        if (typeof delta !== 'object' || delta === null) {
          return
        }

        if (typeof delta.context === 'undefined' && typeof delta.name !== 'undefined' && typeof delta.version !== 'undefined') {
          this.server = delta
          return
        }

        this.self = applyDeltaToSelf(this.self, delta)
      }
    },

    activate (next) {
      this.$client
        .getSelf()
        .then((response) => {
          this.self = response.body
          this.me = this.self.uuid
          return this.$client.apiGet('/vessels')
        })
        .then((response) => {
          if (typeof response.body === 'object' && response.body !== null) {
            this.vessels = filterObject(response.body, (vessel, id) => {
              if (id === this.me) {
                return false
              }

              return true
            })
          }

          this.$client.connectDelta(`${this.$config.host}:${this.$config.port}`, this.update)
          return next()
        })
        .catch((err) => {
          console.error('Error retrieving self: ' + err.message)
          return next()
        })
    }
  }

  function filterObject (obj, filterFn) {
    let temp = {}
    Object.keys(obj).forEach((key) => {
      if (obj.hasOwnProperty(key)) {
        if (filterFn(obj[key], key) === true) {
          temp[key] = obj[key]
        }
      }
    })
    return temp
  }

  function applyUpdate (cursor, update, source, timestamp) {
    let {path, value} = update

    path = path.split('.')

    path.forEach((segment) => {
      if (typeof cursor[segment] !== 'undefined') {
        cursor = cursor[segment]
      }
    })

    if (typeof value === 'object' && value !== null) {
      cursor = value
      return
    }

    if (typeof value !== 'undefined' && value !== null) {
      cursor.value = value
      cursor.timestmap = timestamp
      cursor.source = source
    }
  }

  function applyDeltaToSelf (self, delta) {
    if (typeof self !== 'object' || self === null || typeof self.uuid === 'undefined') {
      return console.warn('Nothing to update: this.self is empty.')
    }

    if (typeof delta !== 'object' || delta === null) {
      return self
    }

    if (delta.context !== `vessels.${self.uuid}`) {
      return self
    }

    self = JSON.parse(JSON.stringify(self))

    delta.updates.forEach((update) => {
      update.values.forEach((change) => {
        applyUpdate(self, change, update.source, update.timestamp)
      })
    })

    return self
  }
</script>

<style lang="stylus">
  dark-blue = #2C3E50 // rgb(44, 62, 80)
  bright-red = #FC4349 // rgb(252, 67, 73)
  medium-grey = #D7DADB // rgb(215, 218, 219)
  light-blue = #6DBCDB // rgb(109, 188, 219)
  white = #FFFFFF // rgb(255, 255, 255)

  html
    box-sizing border-box

  *, *:before, *:after
    box-sizing inherit

  html, body, main
    width 100%
    height 100%
    padding 0
    margin 0
    overflow-x hidden
    overflow-y auto
    font-size 100%
    font-family 'Karla', 'Helvetica Neue', Helvetica, sans-serif
    background-color dark-blue
    color white

  h1, h2, h3, h4, h5, h6
    font-weight normal
    margin 0
    padding 0

  .dashboard
    display block
    padding 2em

    .widget
      display block
      width 100%
      margin-bottom 1em
      border-radius 5px
      border 1px solid light-blue
      padding .5em .75em
      min-height 120px
      box-shadow 0 3px 0 rgba(109, 188, 219, .8)
      background-color lighten(dark-blue, 3%)
      transition all .25s ease-in-out

      &.blurred
        filter: blur(3px)

      h3.title
        color bright-red
        font-size .9em
        text-align center
        text-transform uppercase

      h1.value
        font-size 4.5em
        text-align center

      h2.value
        font-size 2.5em
        text-align center

  pre
    display block
    padding 2em
    margin 1em
    background-color medium-grey
    color dark-blue
    font-size 0.85em
    border-radius 5px

  .fade-transition
    transition opacity .25s ease-in-out
    opacity 1

  .fade-enter
    display block
    opacity 0

  .fade-leave
    opacity 0
</style>
