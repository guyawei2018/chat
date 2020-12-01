import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import axios from 'axios'
import Router from 'vue-router'
import Mui from 'vue-awesome-mui'
import './base/base.js'

Vue.use(Vant)
Vue.use(Mui)
Vue.prototype.$axios = axios
Vue.config.productionTip = false

axios.defaults.baseURL = 'http://192.168.3.153:18001'
// axios.defaults.baseURL = 'http://guyw.top:28001'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

axios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.push({ name: 'login' }); break
        default:
          Vant.$dialog({ message: error.response.data.content })
      }
    }
    return Promise.reject(error.response.data)
  })
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
