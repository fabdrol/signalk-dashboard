// require('./assets/fonts/karla.css')

import Vue from 'vue'
import SignalK from 'signalk-client'
import App from './App'
import Overlay from './Overlay'
import config from './config.json'

Vue.use({
  install (Vue) {
    const SignalKClient = SignalK.Client
    Vue.$config = Vue.prototype.$config = config
    Vue.$client = Vue.prototype.$client = new SignalKClient(config.host, config.port)
  }
})

Vue.filter('json', (data) => {
  return JSON.stringify(data, null, 2)
})

Vue.component('overlay', Overlay)

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})
