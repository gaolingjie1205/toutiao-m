<template>
  <div class="search-history">
    <van-cell-group>
      <van-cell title="搜索历史">
        <template #right-icon>
          <div class="search-history-deleteIcon">
            <span
              v-if="isDeletingHistory"
              @click="onSearchHistoryClick('', true)"
            >全部删除</span>
            <span
              v-if="isDeletingHistory"
              @click="isDeletingHistory = false"
            >完成</span>
            <!-- 点击垃圾桶图标，开启删除模式 -->
            <van-icon name="delete-o"  v-if="!isDeletingHistory" @click="isDeletingHistory = true"/>
          </div>
        </template>
      </van-cell>
      <!-- 遍历所有搜索历史，点击时是搜索还是删除，由isDeletingHistory决定 -->
      <van-cell
        v-for="(value, index) in searchHistories"
        :key="index"
        @click="onSearchHistoryClick(value)"
      >
        <template #title>
          <span>{{ value }}</span>
        </template>
        <template #right-icon>
          <div class="search-history-deleteIcon">
            <van-icon name="close" v-if="isDeletingHistory" />
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  data () {
    return {
      isDeletingHistory: false // 是否正在删除搜索历史记录
    }
  },
  props: {
    searchHistories: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    onSearchHistoryClick (value = '', forceDelete = false) {
      if (this.isDeletingHistory) {
        console.log('SearchHistory.vue正在删除搜索历史记录')
        this.$emit('delete', value, forceDelete)
      } else {
        this.$emit('search', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-history {
  .search-history-deleteIcon {
    span {
      margin-right: 8px;
    }
  }
  .van-icon-delete-o,
  .van-icon-close {
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    vertical-align: bottom;
  }
}

</style>
