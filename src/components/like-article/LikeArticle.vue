<template>
  <van-button
    type="default"
    :loading="isLikedLoading"
    @click="onLikeArticle"
  >
    <van-icon
      :name="isLiked === 1 ? 'good-job' : 'good-job-o'"
      :color="isLiked === 1 ? '#ff007f' : '#777'"
    />
  </van-button>
</template>

<script>
import { likeArticle, cancelLikeArticle } from '@/api/article'
export default {
  name: 'LikeArticle',
  model: {
    prop: 'isLiked',
    event: 'change'
  },
  data () {
    return {
      isLikedLoading: false // 是否正在点赞/取消点赞文章
    }
  },
  props: {
    articleId: { // 当前文章id
      type: String,
      required: true,
      default: () => ''
    },
    isLiked: { // 是否点赞了当前文章
      type: Number,
      required: true,
      default: () => -1
    }
  },
  methods: {
    async onLikeArticle () {
      this.isLikedLoading = true
      if (this.isLiked === 1 ) {
        try {
          const res = await cancelLikeArticle(this.articleId.toString())
          this.$toast.success('取消点赞成功')
          console.log('LikeArticle.vue取消点赞文章成功')
          console.log(res)
          this.$emit('change', 0)
        } catch (e) {
          this.$toast.fail(`取消点赞失败，${e?.response?.data?.message || '请重试'}`)
          console.log('LikeArticle.vue取消点赞文章发生了错误')
          console.log(e)
        }
      } else {
        try {
          const res = await likeArticle(this.articleId.toString())
          this.$toast.success('点赞成功')
          console.log('LikeArticle.vue点赞文章成功')
          console.log(res)
          this.$emit('change', 1)
        } catch (e) {
          this.$toast.fail(`点赞失败，${e?.response?.data?.message || '请重试'}`)
          console.log('LikeArticle.vue点赞文章发生了错误')
          console.log(e)
        }
      }
      this.isLikedLoading = false
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
