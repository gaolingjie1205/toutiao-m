<template>
  <div>
    <!-- 关注按钮 -->
    <van-button
      type="info"
      round
      :class="{ followed: isFollowed }"
      @click="followOrUnfollowFn"
      :loading="isFollowedLoading"
    >
      <van-icon name="plus" v-if="!isFollowed"/>&nbsp;
      <span>{{ isFollowed ? '已关注' : '关注' }}</span>
    </van-button>
  </div>
</template>

<script>
import { followUser, unfollowUser } from '@/api/user'
// import JSONbig from 'json-bigint'

export default {
  name: 'FollowUser',
  model: {
    prop: 'isFollowed',
    event: 'change'
  },
  data () {
    return {
      isFollowedLoading: false // 是否正在发送关注/取消关注请求
    }
  },
  props: {
    // 是否已关注该用户isFollowed
    isFollowed: {
      type: Boolean,
      required: true,
      default: () => false
    },
    // 文章作者id
    autId: {
      type: [Number, String, Object],
      required: true,
      default: () => ''
    }
  },
  methods: {
    // 关注or取消关注文章作者
    async followOrUnfollowFn () {
      this.isFollowedLoading = true
      if (this.isFollowed) {
        try {
          let formattedAutId = this.autId
          if (typeof formattedAutId === 'object') {
            // 作者id可能是个大数字，先变为字符串数字
            formattedAutId = this.autId.toString()
            console.log('FollowUser.vue检测到autId为大数字，已经修改为字符串数字 ', formattedAutId)
            console.log(formattedAutId)
          }
          const res = await unfollowUser(formattedAutId)
          console.log('FollowUser.vue刚刚已经取消关注了文章作者')
          console.log(res)
          // this.is_followed = !this.is_followed
          // 告诉父组件，修改'是否已关注该用户'状态
          // this.$emit('changeIsFollowed')

          // 假设本自定义组件是个输入框，这里手动触发Input事件，更新父组件的某个Vue变量
          this.$emit('change', false)
        } catch (e) {
          if (e?.response?.status === 401) {
            this.$toast('取消关注失败，请先登录')
          } else {
            this.$toast(`取消关注失败，${e?.response?.data?.message || '请重试'}`)
          }
          console.log('FollowUser.vue取消关注文章作者时发生了错误')
          console.log(e)
        }
        this.isFollowedLoading = false
      } else {
        try {
          let formattedAutId = this.autId
          if (typeof formattedAutId === 'object') {
            // 作者id可能是个大数字，先变为字符串数字
            formattedAutId = this.autId.toString()
            console.log('FollowUser.vue检测到autId为大数字，已经修改为字符串数字 ', formattedAutId)
            console.log(formattedAutId)
          }
          const res = await followUser(formattedAutId)
          console.log('FollowUser.vue刚刚已经关注了文章作者')
          console.log(res)
          // this.is_followed = !this.is_followed
          // 告诉父组件，修改'是否已关注该用户'状态
          // this.$emit('changeIsFollowed')

          // 假设本自定义组件是个输入框，这里手动触发Input事件，更新父组件的某个Vue变量
          this.$emit('change', true)
        } catch (e) {
          if (e?.response?.status === 401) {
            this.$toast('关注失败，请先登录')
          } else {
            this.$toast(`关注失败，${e?.response?.data?.message || '请重试'}`)
          }
          console.log('FollowUser.vue关注文章作者时发生了错误')
          console.log(e)
        }
        this.isFollowedLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
