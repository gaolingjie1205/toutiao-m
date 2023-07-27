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
