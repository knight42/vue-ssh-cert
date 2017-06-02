import 'jquery'
import 'tether'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import Vue from 'vue'
import axios from 'axios'

import App from './App.vue'

Vue.prototype.$http = axios

new Vue({
  el: '#app',
  render: (h) => h(App)
})
