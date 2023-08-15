<template>
  <div class="search-container">
    <!-- 顶部导航栏 -->
    <!-- van-search搜索组件，show-action展示右侧取消按钮，shape设置搜索框容器样式，clearable启用清除图标，search 事件在点击键盘上的搜索/回车按钮后触发，cancel 事件在点击搜索框右侧取消按钮时触发 -->
    <!-- 外层form让ios输入法显示搜索按钮 -->
    <form action="#">
      <van-search
        v-model="searchText"
        show-action
        shape="round"
        placeholder="请输入搜索关键词"
        background="linear-gradient(to top right, rgba(25, 137, 250, 1), rgba(25, 137, 250, 0.5))"
        clearable
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索历史 -->
    <SearchHistory
      v-if="!searchText && !isResultShow"
      :searchHistories="searchHistories"
      @search="onSearch"
      @delete="onDeleteSearchHistory"
    ></SearchHistory>
    <!-- 联想建议 -->
    <SearchSuggestion
      v-if="searchText && !isResultShow"
      :searchText="searchText"
      @search="onSearch"
    ></SearchSuggestion>
    <!-- 搜索结果 -->
    <SearchResult
      v-if="isResultShow"
      :searchText="searchText"
    ></SearchResult>
  </div>
</template>

<script>
import SearchHistory from './components/SearchHistory.vue'
import SearchSuggestion from './components/SearchSuggestion.vue'
import SearchResult from './components/SearchResult.vue'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchPage',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  data () {
    return {
      searchText: '', // 用户输入的搜索内容
      isResultShow: false, // 是否展示搜索结果
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 搜索历史
    }
  },
  watch: {
    searchHistories: {
      // 当"搜索历史"发生改变，自动同步到本地存储，不发AJAX存储到线上
      handler (newValue) {
        console.log('SearchPage.vue监测到搜索历史变更如下，已经存储到本地')
        console.log(newValue)
        setItem('TOUTIAO_SEARCH_HISTORIES', newValue)
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    onSearch (value) {
      console.log('SearchPage.vue检测到用户刚刚输入了搜索内容：', value)
      this.searchText = value // SearchSuggestion.vue传过来的搜索建议，需要同步到input里

      const searchIndex = this.searchHistories.findIndex(valuee => valuee === value)
      if (searchIndex !== -1) {
        this.searchHistories.splice(searchIndex, 1)
      }
      this.searchHistories.unshift(value)

      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
      // history.back()
    },
    // 子组件SearchHistory的delete事件
    onDeleteSearchHistory (value = '', forceDelete = false) {
      // 全部删除
      if (forceDelete) {
        // delete无法删除数组元素
        // for (const index of this.searchHistories) {
        //   delete this.searchHistories[index]
        // }
        this.searchHistories.splice(0, this.searchHistories.length)
      } else {
        // 部分删除
        const historyIndex = this.searchHistories.indexOf(value)
        if (historyIndex >= 0) {
          this.searchHistories.splice(historyIndex, 1)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  padding-top: 108px;

  .van-search {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
  .van-search__action {
    color: #fff;
  }
}
</style>
