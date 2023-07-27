import Vue from 'vue'
import VueRouter from 'vue-router'
// import LoginIndex from '@/views/login/LoginIndex.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginIndex.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
