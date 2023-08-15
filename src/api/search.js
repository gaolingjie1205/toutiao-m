/**
 * 搜索相关请求的网络模块search.js
 */

import request from '@/utils/request'

// 获取联想建议（自动补全）
export const getSuggestions = function (searchText) {
  return request({
    method: 'get',
    url: '/v1_0/suggestion',
    params: {
      q: searchText
    }
  })
}

// 获取搜索结果
export const getSearchResults = function (searchText = '', page = 1, per_page = 10) {
  return request({
    method: 'get',
    url: '/v1_0/search',
    params: {
      page,
      per_page,
      q: searchText
    }
  })
}
