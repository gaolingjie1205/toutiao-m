<template>
  <div class="layout-container">
    <!-- 单页面应用的根页面，这里不使用App.vue，而是使用本页面来加载 -->

    <!-- 二级路由挂载点 -->
    <router-view></router-view>

    <!-- 底部导航栏 -->
    <!-- 在开启路由模式后，无需Vue变量来管理当前激活哪个导航项，改为根据路由来管理，因此删除了active变量 -->
    <van-tabbar route>
      <van-tabbar-item replace to="/home">
        <span class="tabbar-text">首页</span>
        <template #icon>
          <i class="toutiao toutiao-shouye"></i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/qa">
        <span class="tabbar-text">问答</span>
        <template #icon>
          <i class="toutiao toutiao-wenda"></i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/video">
        <span class="tabbar-text">视频</span>
        <template #icon>
          <i class="toutiao toutiao-shipin"></i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/my">
        <span class="tabbar-text">{{ $store.state.user ? '我的' : '未登录' }}</span>
        <template #icon>
          <i class="toutiao toutiao-wode"></i>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
// 底部导航栏
.van-hairline--top-bottom {
  user-select: none;

  // 字体图标
  .toutiao {
    font-size: 40px;
  }
  // 文字
  .tabbar-text {
    font-size: 25px;
  }
}
</style>
