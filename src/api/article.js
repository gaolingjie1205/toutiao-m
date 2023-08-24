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

// 获取新闻详情
export const getArticleById = function (articleId) {
  return request({
    method: 'get',
    url: `/v1_0/articles/${articleId}`
  })
}

// 收藏文章
export const collectArticle = function (target) {
  return request({
    method: 'post',
    url: '/v1_0/article/collections',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      target // 要收藏的文章id，接口要求是整数，但是有些文章id为字符串
    }
  })
}

// 取消收藏文章
export const cancelCollectArticle = function (target) {
  return request({
    method: 'delete',
    url: `/v1_0/article/collections/${target}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    // target 要取消收藏的文章id，接口要求是整数，但是有些文章id为字符串
  })
}

// 对文章点赞
export const likeArticle = function (target) {
  return request({
    method: 'post',
    url: '/v1_0/article/likings',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      target // 要收藏的文章id，接口要求是整数，但是有些文章id为字符串
    }
  })
}

// 取消对文章点赞
export const cancelLikeArticle = function (target) {
  return request({
    method: 'delete',
    url: `/v1_0/article/likings/${target}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
