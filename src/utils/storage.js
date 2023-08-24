/**
 * utils/storage.js 本地存储操作模块
 */
import JSONbig from 'json-bigint'
/**
 * 存储数据到本地存储
 * @param {string} key
 * @param {string | object} value
 * @returns 布尔值，表示存储是否成功
 */
export const setItem = function (key, value) {
  if (typeof value === 'object') {
    value = JSONbig.stringify(value)
  }
  if (typeof key !== 'string' || typeof value !== 'string') {
    return false
  }
  if (key === '' || value === '') {
    return false
  }
  try {
    // 必须始终准备捕获setItem()的异常
    window.localStorage.setItem(key, value)
  } catch (e) {
    console.log(e)
    return false
  }
  return true
}

/**
 * 从本地存储获取数据，如果有对象字符串则会还原成对象
 * @param {string} key
 * @returns 经过JSONbig.parse()之后的数据
 */
export const getItem = function (key) {
  const data = window.localStorage.getItem(key)
  try {
    // 如果该JSON字符串有效,则还原成对象
    return JSONbig.parse(data)
  } catch (e) {
    return data
  }
}

/**
 * 从本地存储移除数据
 * @param {string} key
 * @returns 布尔值,表示删除是否成功
 */
export const removeItem = function (key) {
  if (typeof key !== 'string') {
    return false
  }
  window.localStorage.removeItem(key)
  return true
}
