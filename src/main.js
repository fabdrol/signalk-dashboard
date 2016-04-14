import Vue from 'vue'
import SignalK from 'signalk-client'
import App from './App'
import Overlay from './Overlay'

Vue.use({
  install (Vue) {
    const SignalKClient = SignalK.Client
    Vue.$client = Vue.prototype.$client = new SignalKClient('192.168.21.118', 3000)
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
