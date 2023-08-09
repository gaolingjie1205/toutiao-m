/**
 * 频道列表相关请求的网络模块channel.js
 */

import request from '@/utils/request'

// 获取所有频道列表
export const getAllChannels = function () {
  return request({
    method: 'get',
    url: '/v1_0/channels'
  })
}

// 设置用户的频道（部分覆盖）
// 新增用户的频道，原有的频道不会改变，用PATCH请求真是再合适不过了
export const addUserChannel = function (userChannelArr) {
  return request({
    method: 'patch',
    url: '/v1_0/user/channels',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      channels: userChannelArr
    }
  })
}

// 删除指定用户频道
// 根据频道id来删除指定用户频道
export const deleteUserChannel = function (channelId) {
  return request({
    method: 'delete',
    url: `/v1_0/user/channels/${channelId}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
