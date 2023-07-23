import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入全局scss样式
import '@/styles/index.scss'

// 引入vant组件库
import { Button } from 'vant'
import 'vant/lib/index.css'

Vue.use(Button)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
