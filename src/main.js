// vue
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
// fontawesome
import './assets/fontawesome/css/all.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
