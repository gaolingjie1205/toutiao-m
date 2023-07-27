import Vue from 'vue'
import App from './App.vue'

// 引入路由
import router from './router'

// 引入vuex容器
import store from './store'

// 引入全局scss样式
import '@/styles/index.scss'

// 引入vant组件库
import { Button, NavBar, Form, Field, Toast, CountDown } from 'vant'
import 'vant/lib/index.css'

// 使用 lib-flexible 动态设置 REM 基准值（html 标签的字体大小）
import 'amfe-flexible'

Vue.use(Button)
Vue.use(NavBar)
Vue.use(Form)
Vue.use(Field)
Vue.use(Toast)
Vue.use(CountDown)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
