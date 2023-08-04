<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="首页" fixed placeholder>
      <template #title>
        <van-button type="primary" class="search-btn" >
          <van-icon name="search" />
          <span>搜索</span>
        </van-button>
      </template>
    </van-nav-bar>
    <!-- 频道列表 -->
    <!-- v-model绑定当前tab栏标签对应的index，设置为0默认激活第一个tab栏标签 -->
    <!-- animated令tab栏切换下方内容时拥有转场动画 -->
    <!-- swipeable令用户可以用手指滑动下方内容进行tab栏切换 -->
    <!-- 注意！van-tab自带懒加载功能，只有点击了tab栏标签，才会渲染本tab栏标签内的子组件！ -->
    <van-tabs class="channel-tabs" v-model="activeTab" animated swipeable>
      <van-tab v-for="(channel) in channels" :key="channel.id" :title="channel.name">
        <ArticleList :channel="channel"></ArticleList>
      </van-tab>
      <template #nav-right>
        <!-- <div class="placeholder"></div> -->
        <div class="hamburger-btn">
          <i class="toutiao toutiao-gengduo hamburger-btn"></i>
        </div>
      </template>
    </van-tabs>
  </div>
</template>

<script>
import ArticleList from './components/ArticleList.vue'
import { getUserChannels } from '@/api/user'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList
  },
  data () {
    return {
      activeTab: 0,
      channels: [] // 频道列表，放进tab栏渲染
    }
  },
  methods: {
    async loadChannels () {
      try {
        const channelsData = await getUserChannels()
        console.log('HomeIndex.vue已经获取到了用户的频道')
        console.log(channelsData)
        this.channels = channelsData?.data?.data?.channels || []
      } catch (e) {
        this.$toast('获取用户的频道时发生错误，请刷新页面试试')
        console.log('HomeIndex.vue在获取用户的频道时发生了错误')
        console.log(e)
      }
    }
  },
  created () {
    this.loadChannels()
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  padding-bottom: 100px;

  // 顶部导航栏搜索按钮
  .search-btn {
    width: 555px;
    height: 64px;
    border: 0;
    border-radius: 32px;
    background-color: rgba(0, 0, 0, 0.1);
  }
  // 顶部导航栏搜索图标
  .van-icon-search {
    position: relative;
    top: 3px;
    margin-right: 5px;
    font-size: 32px;
    color: #fff;
  }
  // 频道列表
  .channel-tabs {

    // 因为vant组件库里的tab是个组件，我又在这里的scss加了scoped，要想对该子组件生效这里的scss，就需要使用:deep()伪类
    :deep(.van-tab) {
      min-width: 200px; // 与默认的flex:1完美配合
      height: 82px;
      border-right: 1px solid #edeff3;
      color: #777;
      transition: all 0.3s;

      &.van-tab--active { // 导航项激活时，字体变黑变大
        font-size: 32px;
        color: #000;
      }
    }
    :deep(.van-tabs__wrap) {
      position: fixed;
      top: 92px;
      z-index: 1;
      overflow-x: scroll;
      width: 100%;

      .van-tabs__nav {
        padding: 0 0 0.4rem;

        div.placeholder {
          // 占位符，因为汉堡导航按钮会把最后一个导航项覆盖一部分，因此让出来这部分位置
          flex-shrink: 0;
          width: 60px;
        }
        div.hamburger-btn {
          // 需要一个汉堡导航按钮，固定在屏幕上显示
          display: flex;
          justify-content: center;
          align-items: center;
          position: sticky;
          top: 0;
          right: 0;
          z-index: 2;
          width: 60px;
          height: 82px;
          padding: 15px;
          background-color: rgba(255, 255, 255, 1);
          cursor: pointer;

          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 2px;
            height: 82px;
            background-image: url('@/assets/gradient-gray-line.png');
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
          }
          i {
            font-size: 32px;
            color: #000;
          }
        }
      }
      .van-tabs__line { // 滑动条
        bottom: calc(0.4rem + 8px);
        width: 50px;
        background-color: lightskyblue;
      }
    }
    :deep(.van-tabs__content) {
      margin-top: 88px;
    }
  }
}
</style>
