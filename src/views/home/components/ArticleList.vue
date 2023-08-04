<template>
  <div class="article-list">
    <!-- 下拉刷新组件 -->
    <!-- refresh是下拉刷新事件 -->
    <!-- success-text是刷新成功/失败文案，这里我自定义一下，顺便展示刚刚更新了多少条文章数据 -->
    <!-- success-duration是刷新成功/失败文案展示时间，拉长一点 -->
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      success-duration="1200"
    >
      <!-- 文章列表组件，在HomeIndex.vue里面的每个频道都会用该组件渲染其所有文章 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <!-- <van-cell v-for="(value, index) in list" :key="index" :title="value.title" /> -->
        <ArticleItem v-for="(value, index) in list" :key="index" :article="value"></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item/ArticleItem.vue'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  data () {
    return {
      list: [], // 文章列表
      loading: false, // (是否加载中) 当组件滚动到底部时，如果 loading 为 false ，则会触发 load 事件并由 List 组件将 loading 设置成 true ，此时可以在 onLoad 内发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可
      finished: false, // (是否全部加载) 若数据已全部加载完毕，则直接将 finished 设置成 true 即可，此时不会再触发 load 事件并将 loading 设置成 true
      error: false, // (是否发生加载错误) 若列表数据加载失败，此时将 error 设置成 true 即可显示错误提示，用户点击错误提示后会重新触发 load 事件
      pre_timestamp: '',
      isRefreshLoading: false, // (是否正在下拉刷新) 若用户在文章列表顶部下拉，则会触发下拉刷新组件的refresh事件，并由组件将 isRefreshLoading 设置为 true ，此时开发者需要在refresh事件处理函数中手动将 isRefreshLoading 设置为 false
      refreshSuccessText: '刷新成功'
    }
  },
  props: {
    // {id: 1, name: 'xxx'}
    channel: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      try {
        const resultArticleList = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.pre_timestamp ? this.pre_timestamp : Date.now() // 请求第1页数据，传当前时间戳；请求更多页数据，传请求前1页数据时获取到的pre_timestamp时间戳
        })
        console.log('ArticleList.vue刚刚获取文章新闻推荐如下')
        console.log(resultArticleList)
        this.pre_timestamp = resultArticleList.data.data.pre_timestamp || ''
        this.list.push(...resultArticleList.data.data.results)
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成，判断依据就是响应报文的results属性，看还有没有文章内容
        if (!resultArticleList.data.data.results.length) {
          this.finished = true
        }
      } catch (e) {
        this.loading = false
        this.error = true
        console.log('ArticleList.vue在获取文章新闻推荐时发生错误')
        console.log(e)
      }
    },
    async onRefresh () {
      try {
        const resultArticleList = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now() // // 下拉刷新时，需要获取最新数据，而不是接着上次的历史时间戳继续获取
        })
        console.log('ArticleList.vue刚刚获取全新的文章新闻推荐如下')
        console.log(resultArticleList)
        this.pre_timestamp = resultArticleList.data.data.pre_timestamp || ''
        // 下拉刷新完成时，获取到的新数据需要放到当前文章列表组件的顶部，已经加载的数据靠后放，这才符合平时使用APP的习惯
        this.list.unshift(...resultArticleList.data.data.results)
        // 修改刷新成功/失败文案
        this.refreshSuccessText = `刷新成功，更新了${resultArticleList.data.data.results.length}条数据`
        this.isRefreshLoading = false
      } catch (e) {
        this.refreshSuccessText = '刷新失败，请重试'
        this.isRefreshLoading = false
        console.log('ArticleList.vue在获取全新的文章新闻推荐时发生错误')
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.article-list {
  overflow: auto;
  height: 80vh; // 为了让每个文章列表tab栏都能独立保存滚动位置，且不希望挨个给本元素的所有祖先元素都设置高度，这里偷懒写了个vh
}
</style>
