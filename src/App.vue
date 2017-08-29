<template>
  <main id="app">
    <header class="header">
      <span class="header-utc">{{ time.utc().format('HH:mm') }} (UTC)</span>
      <span class="header-title" @click="reconnect">{{ config.name }}</span>
      <span class="header-time">{{ time.tz('Europe/Amsterdam').format('HH:mm') }}</span>
    </header>

    <section class="dashboard" v-if="connected === true && loading === false">
      <speed :data="self.navigation" v-if="isObject(self) && isObject(self.navigation)"></speed>
      <course :data="self.navigation" type="courseOverGroundTrue" v-if="isObject(self) && isObject(self.navigation)"></course>
      <position :data="self.navigation.position" v-if="isObject(self) && isObject(self.navigation) && isObject(self.navigation.position)"></position>
      <depth  :data="self.environment.depth" v-if="isObject(self) && isObject(self.environment) && isObject(self.environment.depth)"></depth>
    </section>

    <section class="is-loading" v-if="loading === true">
      Momentje...
    </section>

    <section class="is-disconnected" v-if="loading === false && connected === false">
      Kon geen verbinding maken.<br>
      <div class="form-button form-button-white" style="width: 200px; display: inline-block;" @click="reconnectOverlayIsActive = true">Opnieuw proberen?</div>

      <overlay v-if="reconnectOverlayIsActive" transition="fade">
        <div class="reconnect-form">
          <div class="form-group" style="height: auto;">
            <label>Signal K server</label>
            <input class="form-input host" style="display: block; width: 100%; margin-bottom: .5em;" type="text" name="setconfig.host" v-model="setconfig.host" placeholder="demo.signalk.org">
            <input class="form-input port" style="display: block; width: 100%;" type="text" name="setconfig.port" v-model="setconfig.port" placeholder="80">
          </div>

          <div class="form-button" @click="reconnect">Verbinden</div>
          <div class="form-button form-button-white" @click="reconnectOverlayIsActive = false">Annuleren</div>
        </div>
      </overlay>
    </section>
  </main>
</template>

<script>
  import moment from 'moment-timezone'
  import position from './widgets/position'
  import depth from './widgets/depth'
  import course from './widgets/course'
  import speed from './widgets/speed'
  import config from './config.json'

  export default {
    components: {
      'position': position,
      'course': course,
      'speed': speed,
      'depth': depth
    },

    data () {
      return {
        config,
        me: '',
        self: {},
        server: {},
        vessels: {},
        interval: null,
        time: moment(),
        history: [],
        timeout: null,
        connected: false,
        loading: true,
        reconnectOverlayIsActive: false,
        pollTimeout: null,
        setconfig: {
          host: config.host,
          port: config.port,
        }
      }
    },

    methods: {
      isObject (mixed) {
        return this.$isObject(mixed)
      },

      reload () {
        window.location.reload()
      },

      update (delta) {
        if (this.config.websockets === false) {
          return
        }

        if (typeof delta !== 'object' || delta === null) {
          return
        }

        if (typeof delta.context === 'undefined' && typeof delta.name !== 'undefined' && typeof delta.version !== 'undefined') {
          this.server = delta
          return
        }

        if (this.timeout) {
          clearTimeout(this.timeout)
        }

        this.self = applyDeltaToSelf(this.self, delta)

        this.timeout = setTimeout(() => {
          console.warn('Al 30s geen update ontvangen! Data is niet meer up-to-date.')
        }, 30000)
      },

      reconnect (initial, next) {
        if (initial !== true) {
          // Set new config based on input
          const c = this.setconfig
          this.$config.host = c.host === '' ? 'demo.signalk.org' : c.host
          this.$config.port = (c.port === '' || c.port === 0) ? 80 : c.port

          // Change hostname/port inside the $client
          this.$client.hostname = this.$config.host
          this.$client.port = this.$config.port
        }

        if (typeof next !== 'function') {
          next = () => {}
        }

        this.loading = true
        this.connected = false

        this
        .$client
        .getSelf()
        .then((response) => {
          this.self = response.body
          this.me = this.self.uuid
          this.connected = true
          this.loading = false
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

          if (this.config.websockets === true) {
            this.$client.connectDelta(`${this.$config.host}:${this.$config.port}`, this.update)
          } else {
            this.pollTimeout = setTimeout(this.poll.bind(this), this.config.refreshRate)
          }

          return next()
        })
        .catch(() => {
          this.connected = false
          this.loading = false
          return next()
        })
      },

      reload () {
        this
        .$client
        .getSelf()
        .then((response) => {
          this.self = response.body
          this.me = this.self.uuid
          this.connected = true
          this.loading = false
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

          if (this.config.websockets === true) {
            this.$client.connectDelta(`${this.$config.host}:${this.$config.port}`, this.update)
          } else {
            this.pollTimeout = setTimeout(this.poll.bind(this), this.config.refreshRate)
          }

          return next()
        })
        .catch(() => {
          this.connected = false
          this.loading = false
          return next()
        })
      },

      poll () {
        if (this.pollTimeout !== null) {
          clearTimeout(this.pollTimeout)
          this.pollTimeout = null
        }

        this.reload()
      },
    },

    activate (next) {
      this.interval = setInterval(() => {
        this.time = moment()
      }, 1000)

      this.reconnect(true, next)
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
      if (typeof cursor[segment] === 'undefined') {
        cursor[segment] = {}
      }

      cursor = cursor[segment]
    })

    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach((prop) => {
        cursor[prop] = value[prop]
      })

      cursor.timestamp = timestamp
      cursor.source = source
      return
    }

    if (typeof value !== 'undefined' && value !== null) {
      cursor.value = value
      cursor.timestamp = timestamp
      cursor.source = source
      return
    }

    console.warn('Unknown value type:', typeof value, value)
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

  .header
    display block
    width 100%
    height 40px
    position absolute
    top 0
    left 0
    background-color dark-blue
    text-align center
    border-bottom 1px solid rgba(109, 188, 219, .5)
    z-index 9999

    > span
      display inline-block
      height 40px
      line-height 40px
      text-transform uppercase
      color bright-red
      font-weight bold
      font-size 1.1em

      &.header-utc
        position absolute
        left 1em
        top 0
        color rgba(255, 255, 255, 0.8)
        font-weight normal
        font-size .9em

      &.header-time
        position absolute
        right 1em
        top 0
        color rgba(255, 255, 255, 0.8)
        font-weight normal
        font-size .9em

  .is-loading, .is-disconnected
    display block
    padding 4em 2em 2em 2em
    overflow hidden
    text-align center
    color white

  .dashboard
    display block
    padding 4em 2em 2em 2em
    overflow hidden

    .widget
      display block
      width 100%
      margin-bottom 1.5em
      border-radius 5px
      border 1px solid light-blue
      height 150px
      box-shadow 0 3px 0 rgba(109, 188, 219, .8)
      background-color lighten(dark-blue, 3%)
      transition all .25s ease-in-out
      position relative

      .widget-background
        display block
        width 100%
        height 35%
        position absolute
        top 65%
        left 0
        z-index 1
        opacity .8

      .widget-contents
        display block
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        padding .75em
        z-index 2

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

      .stale
        color bright-red

      .combined-values
        display block
        width 100%
        height 80%
        overflow hidden
        margin-top .5em

        h1.value-right, h1.value-left
          display block
          width 50%
          text-align center
          float right
          font-size 4em

        h1.value-left
          float left

        h1 span
          display block
          font-size .2em
          color bright-red
          text-transform uppercase

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

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait)
  .dashboard
    .widget
      width 47%
      height 125px
      margin-left 1.5%
      margin-right 1.5%
      float left

      h3.title
        font-size .9em

      h1.value
        font-size 4.5em

      h2.value
        font-size 2.25em

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape)
  .dashboard
    .widget
      width 47%
      height 160px
      margin-left 1.5%
      margin-right 1.5%
      margin-bottom 2em
      float left

      h3.title
        font-size .9em

      h1.value
        font-size 4.5em

      h2.value
        font-size 2.25em

@media only screen and (min-width: 1024px)
  .dashboard
    .widget
      width 30%
      height 150px
      margin-left 1.5%
      margin-right 1.5%
      margin-bottom 2em
      float left

      h3.title
        font-size .9em

      h1.value
        font-size 4.5em

      h2.value
        font-size 2.25em
</style>
