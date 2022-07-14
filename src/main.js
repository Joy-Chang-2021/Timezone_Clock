// vue
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// bootstrap
import 'popper.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap'
import $ from 'jquery'
// fontawesome
import './assets/fontawesome/css/all.css'

Vue.config.productionTip = false

$(() => {
  $('#app').tooltip({
    selector: '[data-toggle="tooltip"]'
  })
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')