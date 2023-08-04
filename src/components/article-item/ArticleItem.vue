<template>
  <!-- 文章列表项组件，接收文章信息并展示，可以点击查看文章内容 -->
  <div class="article-item">
    <van-cell-group>
      <van-cell>
        <!-- 文章标题 -->
        <template #title>
          <div class="article-item-title">{{ article.title }}</div>
        </template>
        <!-- 文章相关信息、3张图片 -->
        <template #label>
          <div class="article-item-label">
            <!-- 因为default插槽会靠右显示内容，但是设计稿里面3张图片是占据一整行的，考虑到label插槽就是在下面占据一整行，因此借用一下label插槽另起一行，放3张图片 -->
            <!-- 3张图片虽少，但是我还是要养成v-for简写的习惯 -->
            <div class="article-item-label-imageWrapper" v-if="article?.cover?.images?.length === 3">
              <van-image
                v-for="(valueSrc, index) in article.cover.images"
                :key="index"
                :src="valueSrc"
                fit="cover"
              />
            </div>

            <span>{{ article.aut_name }}</span>
            <span>{{ article.comm_count }}评论</span>
            <span>{{ article.pubdate | relativeTime }}</span>
          </div>
        </template>
        <!-- 1张图片，根据图片数量，会改变单元格的显示结构 -->
        <template #default>
          <div class="article-item-default">
            <div v-if="article?.cover?.images?.length === 1">
              <van-image
                :src="article.cover.images[0]"
                fit="cover"
              />
            </div>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'ArticleItem',
  data () {
    return {}
  },
  props: {
    article: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  created () {}
}
</script>

<style lang="scss" scoped>
.article-item {
  // 文章标题
  .van-cell__value {
    flex: 0 1 auto;
    // flex: unset;
    margin-left: 25px;
  }
  .article-item-title {
    font-size: 32px;
    color: #3a3a3a;
  }
  // 文章相关信息、3张图片
  .article-item-label {
    & > span {
      margin-right: 25px;
      color: #b4b4b4;
    }
    & > .article-item-label-imageWrapper {
      display: flex;
      padding: 30px 0;

      .van-image {
        margin-right: 5px;
        width: 230px;
        height: 176px;

        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
  // 1张图片
  .article-item-default {
    .van-image {
      margin-right: 5px;
      width: 240px;
      height: 180px;
    }
  }
}
</style>
