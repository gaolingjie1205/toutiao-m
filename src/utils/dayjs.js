// 引入day.js提供的日期格式化功能
import Vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-cn') // 全局加载中文语言文件
dayjs.extend(relativeTime) // 使用RelativeTime插件来显示相对时间

Vue.filter('relativeTime', value => { // 定义一个过滤器，在Vue模板里快速调用
  return dayjs().to(dayjs(value)) // '2000-01-01 00:00:00' => 23 年前
})

export default dayjs
