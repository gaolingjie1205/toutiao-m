<template>
  <div class="my-container">
    <!-- 未登录 -->
    <div class="header not-login" v-if="!user">
      <div class="login-btn" @click="$router.push({name: 'login'})">
        <img src="@/assets/mobile.png" alt="">
        <p class="login-btn-text">登录/注册</p>
      </div>
    </div>
    <!-- 已登录 -->
    <div class="header user-info" v-if="user">
      <div class="user-info-base">
        <div class="left">
          <!-- 圆形、填充头像 -->
          <van-image class="avatar" :src="userInfo.photo" round fit="cover"></van-image>
          <!-- 昵称 -->
          <span class="user-info-base-nickname">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button type="default" size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <div class="user-info-data">
        <div class="user-info-data-item">
          <p class="count">{{ userInfo.art_count || 88 }}</p>
          <p class="text">头条</p>
        </div>
        <div class="user-info-data-item">
          <p class="count">{{ userInfo.follow_count || 88 }}</p>
          <p class="text">关注</p>
        </div>
        <div class="user-info-data-item">
          <p class="count">{{ userInfo.fans_count || 88 }}</p>
          <p class="text">粉丝</p>
        </div>
        <div class="user-info-data-item">
          <p class="count">{{ userInfo.like_count || 88 }}</p>
          <p class="text">获赞</p>
        </div>
      </div>
    </div>
    <!-- 栅格导航 -->
    <van-grid class="grid-nav" column-num="2" clickable>
      <van-grid-item class="grid-item">
        <template #icon>
          <i class="toutiao toutiao-shoucang"></i>
        </template>
        <template #text>
          <span class="grid-item-text">收藏</span>
        </template>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <template #icon>
          <i class="toutiao toutiao-lishi"></i>
        </template>
        <template #text>
          <span class="grid-item-text">历史</span>
        </template>
      </van-grid-item>
    </van-grid>
    <!-- 功能单元格 -->
    <div class="cells">
      <van-cell title="消息通知" is-link />
      <van-cell title="小智同学" is-link />
    </div>
    <van-cell title="退出登录" class="logout-cell" clickable v-if="user" @click="onLogOut()"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user.js'
export default {
  name: 'MyIndex',
  data () {
    return {
      // 用户个人资料
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 退出登录
    onLogOut () {
      this.$dialog.confirm({
        title: '确认退出登录吗？'
      }).then(() => {
        // on close
        console.log('用户已经退出登录')
        // 移除本地存储、vuex容器里面的token
        this.$store.commit('setUser', null)
      }).catch(() => {
        // on cancel
        console.log('用户取消了退出登录')
      })
    },
    // 获取用户个人资料
    async loadUserInfo () {
      try {
        const userInfo = await getUserInfo()
        console.log('MyIndex.vue获取用户个人资料成功')
        console.log(userInfo)
        if (userInfo.status === 200) {
          this.userInfo = userInfo.data.data
        }
      } catch (e) {
        console.log('MyIndex.vue在获取用户个人资料时发生错误')
        console.log(e)
        this.$toast('获取用户信息失败，请稍后重试')
      }
    }
  },
  async created () {
    if (this.user) {
      console.log('MyIndex.vue已经获取到了全局state.user')
      console.log(this.user)
      this.loadUserInfo()
    } else {
      console.log('MyIndex.vue未获取到全局state.user')
      console.log(this.user)
    }
  }
}
</script>

<style lang="scss" scoped>
.my-container {
  & > .header {
    position: relative;
    height: 361px;
    background-image: url('~@/assets/banner.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    // 未登录
    &.not-login {
      & > .login-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 150px;
        text-align: center;
        transform: translate(-50%, -50%);
        cursor: pointer;

        &:hover > .login-btn-text {
          color: #ff007f;
        }
        img {
          width: 132px;
          margin-bottom: 15px;
        }
        & > .login-btn-text {
          font-size: 28px;
          color: #fff;
          transition: all 0.3s;
        }
      }
    }
    // 已登录
    &.user-info {
      & > .user-info-base {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 231px;
        padding: 76px 32px 23px;

        & > .left {
          display: flex;
          align-items: center;

          // 圆形、填充头像
          .avatar {
            // 要保证图片不被挤压
            flex-shrink: 0;
            width: 132px;
            height: 132px;
            border: 2px solid #fff;
          }
          // 昵称
          & > .user-info-base-nickname {
            // 昵称可能有很多字
            flex-grow: 1;
            overflow: hidden;
            margin-left: 23px;
            font-size: 30px;
            color: #fff;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        & > .right {
          position: relative;
          top: -7px;
        }
      }
      & > .user-info-data {
        display: flex;
        justify-content: space-around;
        height: 130px;
        padding: 0 32px;

        & > .user-info-data-item {
          display: flex;
          flex-basis: 25%;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #fff;

          & > .count {
            font-size: 36px;
          }
          & > .text {
            font-size: 23px;
          }
        }
      }
    }
  }
}

// 栅格导航
.grid-nav {
  .grid-item {
    height: 141px;

    // 字体图标
    .toutiao {
      position: relative;
      top: 2px;   // postcss-pxtorem会把px转换为rem，我这里无需手动计算
      font-size: 37px;

      &.toutiao-shoucang {
        color: #eb5253;
      }
      &.toutiao-lishi {
        color: #ff9d1d;
      }
    }
    span.grid-item-text {
      font-size: 28px !important;
    }
  }
}

// 功能单元格
.cells {
  margin: 10px 0;
}
.logout-cell {
  color: #ff007f;
  text-align: center;
}
</style>
