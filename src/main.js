import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入全局scss样式
import '@/styles/index.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
