// utils/request.js
// 对axios进行二次封装，主要是为了配置一些网络请求设置
import axios from 'axios'
import store from '@/store/index.js'

// 创建一个axios实例对象，来请求黑马服务器
const request = axios.create({
  baseURL: 'https://toutiao.itheima.net/',
  timeout: 3000,
  headers: {
    // Authorization: ''
  }
})

// 添加请求拦截器，在发出请求或接收响应之前对请求或者响应进行处理
// `axios.interceptors.request.use(onFulfilled, onRejected)`：添加请求拦截器。在发送请求之前执行回调函数
// `function (config) {...}`：请求拦截器的回调函数，参数`config`是发送请求时的配置信息。你可以在此处修改、添加或删除请求的配置
// `return config;`：在请求拦截器的回调函数中需要返回修改后的配置信息或原始配置
// `function (error) {...}`：请求拦截器发生错误时的回调函数，参数`error`是错误对象
// `return Promise.reject(error);`：在请求拦截器错误回调函数中需要返回一个被拒绝的Promise，以便后续的错误处理流程能够捕获到错误，这也需要开发者注意捕获此处的错误
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log('request.js已经捕获到了当前请求配置对象')
  // console.log(config)
  if (store.state?.user?.token) {
    config.headers.Authorization = `Bearer ${store.state?.user?.token}`
  }
  // console.log('request.js修改了当前请求配置对象为如下')
  // console.log(config)
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

export default request
