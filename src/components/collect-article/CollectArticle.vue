<template>
  <van-button
    type="default"
    :loading="isCollectedLoading"
    @click="onCollectArticle"
  >
    <van-icon
      :name="isCollected ? 'star' : 'star-o'"
      :color="isCollected ? '#ffa500' : '#777'"
    />
  </van-button>
</template>

<script>
import { collectArticle, cancelCollectArticle } from '@/api/article'
export default {
  name: 'CollectArticle',
  model: {
    prop: 'isCollected',
    event: 'change'
  },
  data () {
    return {
      isCollectedLoading: false // 是否正在收藏/取消收藏文章
    }
  },
  props: {
    articleId: { // 当前文章id
      type: String,
      required: true,
      default: () => ''
    },
    isCollected: { // 是否收藏了当前文章
      type: Boolean,
      required: true,
      default: () => false
    }
  },
  methods: {
    async onCollectArticle () {
      this.isCollectedLoading = true
      if (this.isCollected) {
        try {
          const res = await cancelCollectArticle(this.articleId.toString())
          this.$toast.success('取消收藏成功')
          console.log('CollectArticle.vue取消收藏文章成功')
          console.log(res)
          this.$emit('change', !this.isCollected)
        } catch (e) {
          this.$toast.fail(`取消收藏失败，${e?.response?.data?.message || '请重试'}`)
          console.log('CollectArticle.vue取消收藏文章发生了错误')
          console.log(e)
        }
      } else {
        try {
          const res = await collectArticle(this.articleId.toString())
          this.$toast.success('收藏成功')
          console.log('CollectArticle.vue收藏文章成功')
          console.log(res)
          this.$emit('change', !this.isCollected)
        } catch (e) {
          this.$toast.fail(`收藏失败，${e?.response?.data?.message || '请重试'}`)
          console.log('CollectArticle.vue收藏文章发生了错误')
          console.log(e)
        }
      }
      this.isCollectedLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.van-button {
  padding: 0;
  border: 0;

  &::before {
    background-color: transparent;
  }
}
.van-icon {
  transition: all 0.3s;
}
</style>
