<template>
  <div class="search-result">
    <!-- 搜索结果 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击这里重新加载"
      @load="onLoad"
    >
      <van-cell v-for="(value, index) in list" :key="index">
        <template #title>
          <span v-html="value.title"></span>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [], // 数据列表
      loading: false, // 是否加载中
      finished: false, // 是否全部加载
      error: false, // 是否发生加载错误
      page: 1, // 当前搜索结果的页码
      per_page: 10 // 每页搜索结果的数量
    }
  },
  props: {
    // SearchPage.vue传来的，用户输入的搜索内容
    searchText: {
      type: String,
      required: true,
      default: () => ''
    }
  },
  methods: {
    async onLoad () {
      try {
        const res = await getSearchResults(this.searchText, this.page, this.per_page)
        console.log('SearchResult.vue刚刚获取到了搜索结果')
        console.log(res)
        if (res?.data?.data?.results instanceof Array) {
          this.list.push(...res?.data?.data?.results)
          this.page++
          // 加载结束
          this.loading = false
          // 数据全部加载完成
          if (res?.data?.data?.results?.length === 0) {
            this.finished = true
          }
        } else {
          this.loading = false
          this.finished = true
        }
      } catch (e) {
        this.$toast('获取搜索结果失败，请稍后重试')
        this.loading = false
        // 错误标志
        this.error = true
        console.log('SearchResult.vue获取搜索结果时发生了错误')
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
