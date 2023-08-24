/**
 * 用户相关请求的网络模块user.js
 */

import request from '@/utils/request'

// 用户认证（登录注册）
export const login = function (data) {
  return request({
    method: 'post',
    url: '/v1_0/authorizations',
    data
  })
}

// 发送短信验证码
export const getSmsCode = function (mobile) {
  return request({
    method: 'get',
    url: `/v1_0/sms/codes/${mobile}`
  })
}

// 获取用户个人资料
export const getUserInfo = function () {
  return request({
    method: 'get',
    url: '/v1_0/user/profile'
  })
}

// 获取用户的频道
export const getUserChannels = function () {
  return request({
    method: 'get',
    url: '/v1_0/user/channels'
  })
}

// 关注用户
export const followUser = function (target = '') {
  // target目标用户id
  return request({
    method: 'post',
    url: '/v1_0/user/followings',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      target
    }
  })
}

// 取消关注用户
export const unfollowUser = function (target = '') {
  // target目标用户id
  return request({
    method: 'delete',
    url: '/v1_0/user/followings/' + target,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
