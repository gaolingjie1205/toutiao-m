// utils/request.js
// 对axios进行二次封装，主要是为了配置一些网络请求设置
import axios from 'axios'

// 请求黑马服务器
// axios.defaults.baseURL = "https://applet-base-api-t.itheima.net/"
const request = axios.create({
  // baseURL: "https://applet-base-api-t.itheima.net/",
  baseURL: 'https://toutiao.itheima.net/',
  timeout: 3000,
  headers: {
    // Authorization: ''
  }
})

export default request
