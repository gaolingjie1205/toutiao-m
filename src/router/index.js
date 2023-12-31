import Vue from 'vue'
import VueRouter from 'vue-router'
// import LoginIndex from '@/views/login/LoginIndex.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/layout/LayoutIndex.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home', // 默认子路由
        name: 'home',
        component: () => import('@/views/home/HomeIndex.vue')
      },
      {
        path: 'qa',
        name: 'qa',
        component: () => import('@/views/qa/QaIndex.vue')
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video/VideoIndex.vue')
      },
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my/MyIndex.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginIndex.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/SearchPage.vue')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article/ArticleIndex.vue'),
    props: true // 把实际的URL动态参数映射到component属性指定的组件的props
  }
]

const router = new VueRouter({
  routes
})

export default router
