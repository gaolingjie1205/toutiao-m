import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
Vue.use(Vuex)

// 方便维护的变量名
const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 页面刚打开，读取现有的token
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY) || '{}')
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser (state, payload) {
      // 更新当前用户的手机号对应的两个token，并放进本地存储，这样刷新页面也能直接拿到token，无需反复登录
      // 序列化时，其实把响应式的getter与setter扔了，因为函数无法序列化
      state.user = payload
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  getters: {
  },
  modules: {
  }
})
