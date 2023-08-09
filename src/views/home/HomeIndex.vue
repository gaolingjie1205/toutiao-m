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
        <div class="hamburger-btn" @click="isChannelEditShow = !isChannelEditShow">
          <i class="toutiao toutiao-gengduo hamburger-btn"></i>
        </div>
      </template>
    </van-tabs>

    <!-- 频道弹出层，用户可以定制自己的频道 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      close-icon-position="top-left"
      round
      position="bottom"
      :style="{ height: '90%' }"
    >
      <!-- 频道编辑组件 -->
      <ChannelEdit
        :channels="channels"
        :activeTab="activeTab"
        :activeTabId="activeTabId"
        @addChannel="addChannel"
        @removeChannel="removeChannel"
        @changeChannel="changeChannel"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { mapState } from 'vuex'
import { getUserChannels } from '@/api/user'
import { addUserChannel, deleteUserChannel } from '@/api/channel'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      activeTab: 0, // 当前显示的用户的频道索引
      activeTabId: 0, // 当前显示的用户的频道id
      channels: [], // 用户的频道列表，放进tab栏、频道编辑组件里渲染
      isChannelEditShow: true // 弹出层是否弹出
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 加载用户的频道
    async loadChannels () {
      // 用户已登录，则从黑马服务器获取用户的频道
      // 用户未登录，则从本地存储获取用户的频道
      if (this?.user?.token) {
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
      } else {
        const res = getItem('TOUTIAO_DEFAULT_CHANNELS') || []
        if (res.length === 0) {
          // 如果用户第一次打开本页面，这时候什么频道都没有，那也不能什么都不显示，还是要发请求获取默认用户的频道，并且保存到本地存储
          try {
            const channelsData = await getUserChannels()
            console.log('HomeIndex.vue已经获取到了默认用户的频道')
            console.log(channelsData)
            this.channels = channelsData?.data?.data?.channels || []
            setItem('TOUTIAO_DEFAULT_CHANNELS', this.channels)
          } catch (e) {
            this.$toast('获取默认用户的频道时发生错误，请刷新页面试试')
            console.log('HomeIndex.vue在获取默认用户的频道时发生了错误')
            console.log(e)
          }
        } else {
          this.channels = res
        }
      }
    },

    // 子组件ChannelEdit.vue "频道推荐"的点击事件，点击某个频道，将它添加进"我的频道"，并从"频道推荐"移除它
    async addChannel (recommendChannel) {
      this.channels.push(recommendChannel)

      // 不仅是在HomeIndex.vue里存储channels，还需要做"数据持久化处理"
      // 1、未登录，把"用户的频道"存储到本地
      // 2、已登录，通过黑马提供的接口，把"用户的频道"存储到服务器
      // 这样处理之后，即使用户不登陆，但是还是能看到自己在手机上拥有的频道，不过仅限于此手机，换手机就看不见了；登录后就能到处查看自己的账号频道
      if (this?.user?.token) {
        console.log('HomeIndex.vue已经检测到用户的token如下：')
        console.log(this.user.token)
        try {
          const res = await addUserChannel([{
            id: recommendChannel.id,
            seq: this.channels.length // 序号，表示新频道要排列的顺序位置
          }])
          console.log('HomeIndex.vue已经向服务器提交了新增的用户频道')
          console.log(res)
        } catch (e) {
          this.$toast('提交新频道到服务器时发生错误，请刷新页面试试')
          console.log('HomeIndex.vue向服务器提交新增的用户频道时发生了错误')
          console.log(e)
        }
      } else {
        console.log('HomeIndex.vue未检测到用户的token，当前未登录')
        setItem('TOUTIAO_DEFAULT_CHANNELS', this.channels)
      }
    },

    // 子组件ChannelEdit.vue "我的频道"的点击事件
    // <!-- 当'是否正在编辑用户的频道'为真时，点击栅格导航项，从'用户的频道'移除，然后添加到'所有频道列表' -->
    // <!-- 当'是否正在编辑用户的频道'为假时，点击栅格导航项，关闭弹出层，进入指定频道 -->
    async removeChannel (id) {
      const index = this.channels.findIndex(value => value.id === id)
      if (index > 0) {
        // 如果正好删除了当前用户的频道，则切回'推荐'频道
        if (this.activeTabId === id) {
          this.activeTab = 0
          this.activeTabId = 0
        }
        this.channels.splice(index, 1)

        // 不仅是在HomeIndex.vue里存储channels，还需要做"数据持久化处理"
        // 1、未登录，把"用户的频道"存储到本地
        // 2、已登录，通过黑马提供的接口，把"用户的频道"存储到服务器
        // 这样处理之后，即使用户不登陆，但是还是能看到自己在手机上拥有的频道，不过仅限于此手机，换手机就看不见了；登录后就能到处查看自己的账号频道
        if (this?.user?.token) {
          console.log('HomeIndex.vue已经检测到用户的token如下：')
          console.log(this.user.token)
          try {
            const res = await deleteUserChannel(id)
            console.log('HomeIndex.vue已经向服务器提交了删除的用户频道')
            console.log(res)
          } catch (e) {
            this.$toast('提交删除的频道到服务器时发生错误，请刷新页面试试')
            console.log('HomeIndex.vue向服务器提交删除的用户频道时发生了错误')
            console.log(e)
          }
        } else {
          console.log('HomeIndex.vue未检测到用户的token，当前未登录')
          setItem('TOUTIAO_DEFAULT_CHANNELS', this.channels)
        }
      }
    },

    changeChannel (id) {
      const index = this.channels.findIndex(value => value.id === id)
      if (index > 0) {
        this.activeTab = index
        this.activeTabId = id
        this.isChannelEditShow = false
      }
    }
  },
  created () {
    this.loadChannels()
  },
  activated () {
    // 切换到首页，需要判断当前用户是否登录，如果未登录，则需要加载本地数据：用户的频道
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
  // 频道弹出层
  .van-popup {
    overflow: auto;
    padding-top: 100px;
  }
}
</style>
