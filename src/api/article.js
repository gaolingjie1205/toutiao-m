/**
 * 文章相关请求的网络模块article.js
 */

import request from '@/utils/request'

// 获取文章新闻推荐
export const getArticles = function (params) {
  return request({
    method: 'get',
    url: '/v1_0/articles',
    params
    // {
    //   channel_id,
    //   timestamp
    // }
  })
}
