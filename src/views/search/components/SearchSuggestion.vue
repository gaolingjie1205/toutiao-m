<template>
  <div class="search-suggestion">
    <van-cell-group>
      <!-- 点击搜索建议，告诉SearchPage.vue修改用户输入的搜索内容，并执行搜索 -->
      <van-cell
        v-for="(value, index) in suggestionList"
        :key="index"
        @click="$emit('search', value)"
      >
        <template #title>
          <van-icon name="search" class="search-icon" />
          <span v-html="highlightKeyWords(value)"></span>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { getSuggestions } from '@/api/search.js'

export default {
  name: 'SearchSuggestion',
  data () {
    return {
      suggestionList: []
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
  watch: {
    searchText: {
      // 使用最终的防抖函数，限制发AJAX的频率
      handler (newValue) {
        // 千万要注意，每一个防抖函数，都拥有一个独立的timer，我最开始每次都依赖debouncedOnGetSuggestions返回一个防抖函数，导致输入几次就发送几次AJAX，找了半天原因，切记
        this.debouncedOnGetSuggestions(newValue)
      },
      immediate: true
    }
  },
  methods: {
    // 高亮搜索建议中的关键词
    highlightKeyWords (suggestion) {
      if (suggestion) {
        const THIS = this
        const res = suggestion.replace(new RegExp(THIS.searchText, 'g'), search => {
          return `<span style="color: #ff007f">${search}</span>`
        })
        return res
      } else {
        return ''
      }
    }
  },
  // 在组件实例加载完毕时，生成防抖函数
  // 但是第一次输入后，才会生成本组件，无法为第一次输入提供搜索建议，故此方法不可行
  beforeCreate () {
    // 防抖函数生成器
    function debounce (func, delay) {
      let timer = null
      return function () {
        clearTimeout(timer)
        timer = setTimeout(() => {
          func.apply(this, arguments)
        }, delay)
      }
    }
    // 获取搜索建议的原始事件处理函数
    async function onGetSuggestions (newValue) {
      try {
        // if (newValue === '') {
        //   console.log('用户输入了空搜索内容，不获取搜索建议')
        //   return
        // }
        const res = await getSuggestions(newValue)
        console.log('SearchSuggestion.vue刚刚拿到了搜索建议：')
        console.log(res)
        // 接口有可能会返回一个包含Null的数组
        this.suggestionList = res?.data?.data?.options.filter(value => Boolean(value)) || []
      } catch (e) {
        // this.$toast('获取搜索建议时发生了错误，请刷新试试')
        console.log('SearchSuggestion.vue获取搜索建议时发生了错误：')
        console.log(e)
      }
    }
    // 用上面两个工具，生成最终的防抖函数，并要求立即执行它，debouncedOnGetSuggestions本身由监听器执行
    this.debouncedOnGetSuggestions = debounce(onGetSuggestions, 500)
  }
}
</script>

<style lang="scss" scoped>
.search-suggestion {
  .van-icon-search {
    display: inline-block;
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    vertical-align: bottom;
  }
}
</style>
