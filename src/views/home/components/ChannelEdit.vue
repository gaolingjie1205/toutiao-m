<template>
  <div class="channel-edit">
    <!-- 频道编辑组件，在HomeIndex.vue中为频道弹出层提供内容 -->
    <!-- 1、我的频道 -->
    <van-cell :border="false">
      <template #title>
        <span class="channel-edit-title">我的频道</span>
      </template>
      <template #right-icon>
        <!-- 只有当'是否正在编辑用户的频道'为真时，才显示'完成'文本 -->
        <!-- 点击此按钮，会切换'是否正在编辑用户的频道' -->
        <van-button
          type="danger"
          round
          size="mini"
          plain
          class="channel-edit-btn"
          @click="isEditingChannels = !isEditingChannels"
          >{{ isEditingChannels ? '完成' : '编辑' }}</van-button
        >
      </template>
    </van-cell>

    <!-- 栅格导航 -->
    <van-grid class="grid-nav" column-num="4" clickable :gutter="10">
      <!-- 当'是否正在编辑用户的频道'为真时，点击栅格导航项，从'用户的频道'移除，然后添加到'所有频道列表' -->
      <!-- 当'是否正在编辑用户的频道'为假时，点击栅格导航项，关闭弹出层，进入指定频道 -->
      <van-grid-item
        class="grid-item my-grid-item"
        v-for="(value, index) in channels"
        :key="value.id"
        :class="{ active: activeTabId === value.id }"
        @click="onChannelsClick(value, index)"
      >
        <template #text>
          <!-- 只有当'是否正在编辑用户的频道'为真，且不为 "不允许用户删除的'用户的频道'" 时，才显示关闭图标 -->
          <van-icon name="close" v-show="isEditingChannels && fixedChannels.indexOf(value.id) === -1"/>
          <span class="grid-item-text">{{ value.name }}</span>
        </template>
      </van-grid-item>
    </van-grid>

    <!-- 2、频道推荐 -->
    <van-cell :border="false">
      <template #title>
        <span class="channel-edit-title">频道推荐</span>
      </template>
    </van-cell>

    <!-- 栅格导航 -->
    <van-grid class="grid-nav" column-num="4" clickable :gutter="10">
      <van-grid-item
        class="grid-item"
        icon="plus"
        v-for="value in recommendChannels"
        :key="value.id"
        @click="onAddChannel(value)"
      >
        <template #text>
          <span class="grid-item-text">{{ value.name }}</span>
        </template>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'

export default {
  data () {
    return {
      allChannels: [], // 所有频道列表
      isEditingChannels: false, // 是否正在编辑用户的频道
      fixedChannels: [0] // 不允许用户删除的'用户的频道'，用数组保存起来方便使用
    }
  },
  computed: {
    // 推荐频道
    recommendChannels () {
      // 遍历 "所有频道列表allChannels" 数组中的每个频道对象，检查它的id是否在 "用户的频道channels" 数组中，如果不存在就将其对象本身浅拷贝到 "推荐频道recommendChannels" 数组中，最后渲染到视图层

      const THIS = this

      // 1、普通for循环
      // const res = []
      // for (let i = 0; i < THIS.allChannels.length; i++) {
      //   let found = false
      //   for (let j = 0; j < THIS.channels.length; j++) {
      //     if (THIS.allChannels[i].id === THIS.channels[j].id) {
      //       found = true
      //       break // 相同频道，id值相同，不显示在推荐频道
      //     }
      //   }
      //   if (!found) {
      //     res.push(THIS.allChannels[i])
      //   }
      // }

      // 2、基于循环和find，稍微简单一些
      // const res = []
      // THIS.allChannels.forEach(value => { // 这代码量不比普通for循环少？
      //   const foundObj = THIS.channels.find(valuee => value.id === valuee.id)
      //   if (!foundObj) {
      //     res.push(value)
      //   }
      // })

      // 3、直接filter过滤，最快
      const res = THIS.allChannels.filter(value => {
        return !THIS.channels.find(valuee => value.id === valuee.id)
      })
      return res
    }
  },
  props: {
    // 用户的频道
    channels: {
      type: Array,
      required: true,
      default: () => []
    },
    // 当前激活的频道项
    activeTab: {
      type: Number,
      required: true,
      default: () => 0
    },
    // 当前激活的频道项id
    activeTabId: {
      type: Number,
      required: true,
      default: () => 0
    }
  },
  methods: {
    // 获取所有频道列表
    async loadAllChannels () {
      try {
        const allChannels = await getAllChannels()
        console.log('ChannelEdit.vue频道编辑组件刚刚获取到了所有频道列表！')
        console.log(allChannels)
        this.allChannels = allChannels?.data?.data?.channels || []
      } catch (e) {
        this.$toast('获取所有频道列表时发生了错误，请刷新页面试试')
        console.log('ChannelEdit.vue频道编辑组件获取所有频道列表时发生了错误！')
        console.log(e)
      }
    },
    // "频道推荐"的点击事件，点击某个频道，将它添加进"我的频道"，并从"频道推荐"移除它
    onAddChannel (recommendChannel) {
      this.$emit('addChannel', recommendChannel)
    },
    // "我的频道"的点击事件
    // <!-- 当'是否正在编辑用户的频道'为真时，点击栅格导航项，从'用户的频道'移除，然后添加到'所有频道列表' -->
    // <!-- 当'是否正在编辑用户的频道'为假时，点击栅格导航项，关闭弹出层，进入指定频道 -->
    onChannelsClick (channel) {
      if (this.isEditingChannels) {
        if (!this.fixedChannels.includes(channel.id)) {
          this.$emit('removeChannel', channel.id)
        }
      } else {
        this.$emit('changeChannel', channel.id)
      }
    }
  },
  created () {
    this.loadAllChannels()
  }
}
</script>

<style lang="scss" scoped>
.channel-edit {
  .channel-edit-title {
    font-size: 32px;
  }
  .channel-edit-btn {
    width: 104px;
    height: 48px;
    border: 1px solid #f85959;
    font-size: 26px;
    color: #f85959;
  }

  // 栅格导航
  :deep(.grid-nav) {
    // 每个栅格
    .grid-item {
      width: 160px;
      height: 86px;

      &.active .van-grid-item__content {
        color: #ff007f;
      }
      // "我的频道"的每个导航项
      &.my-grid-item .van-grid-item__content {
        position: relative;

        // 关闭图标
        .van-icon-close {
          position: absolute;
          top: -12px;
          right: -18px;
          z-index: 2; // 定位层级拉高一些，避免.van-grid-item__content的边框线压住关闭图标
          color: #666;
        }
      }

      // 每个导航项，注意是.grid-item的子容器，需要单独设置样式
      .van-grid-item__content {
        flex-direction: row; // 修改vant grid项默认column排列
        // overflow: hidden; // 如果文字很多，则隐藏多的
        padding-left: 0;
        padding-right: 0;
        background-color: #f4f5f6;
        font-size: 28px;
        color: #222;

        &:active {
          background-color: #ccc;
        }
        // 加号➕图标
        .van-icon {
          position: relative;
          top: 2px;
          margin-right: 6px;
          font-size: 28px;
          color: #222;
        }
      }
    }
  }
}
</style>
