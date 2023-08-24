<template>
  <div class="article-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="黑马头条文章详情">
      <template #left>
        <van-icon name="arrow-left" color="#fff" size="20px" @click="$router.back()"/>
      </template>
    </van-nav-bar>

    <!-- 文章页面主体 -->
    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoading">
        <!-- vertical令图标和文案垂直排列 -->
        <van-loading color="#333" vertical>加载中</van-loading>
      </div>

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-if="httpStatus === 404">
        <van-icon name="fail" />
        <p class="text">该资源不存在或已删除！</p>
      </div>

      <!-- 加载失败：未知错误 -->
      <div class="error-wrap" v-if="!isNaN(httpStatus) && httpStatus !== 200 && httpStatus !== 404">
        <van-icon name="fail" />
        <p class="text">加载失败！</p>
        <van-button type="default" round @click="loadArticle">点我重新加载</van-button>
      </div>

      <!-- 加载完成，显示文章内容 -->
      <div class="article-detail" v-if="httpStatus === 200">
        <!-- 文章标题 -->
        <div class="article-title">{{ articleInfo.title }}</div>
        <!-- 作者 -->
        <van-cell
          class="user-info"
          center
          :border="false"
        >
          <template #title>
            <!-- 作者头像 -->
            <van-image
              class="avatar"
              fit="cover"
              round
              :src="articleInfo.aut_photo"
            />
            <!-- 作者信息 -->
            <div class="detail">
              <div class="user-info-name">{{ articleInfo.aut_name }}</div>
              <div class="user-info-publish-date">{{ articleInfo.pubdate | relativeTime }}</div>
            </div>
          </template>
          <template #right-icon>
            <!-- 关注按钮 -->
            <!-- @changeIsFollowed="changeIsFollowed" -->
            <!-- @input="changeIsFollowed" -->
            <!-- :value="is_followed" -->

            <!-- FollowUser组件上的v-model默认已经利用了value属性、input事件，无需显式书写这两项 -->
            <!-- 因为FollowUser组件既要使用is_followed，又要修改is_followed，跟表单元素的行为很相似，故使用v-model给FollowUser组件快速绑定Vue变量 -->
            <FollowUser
              :autId="articleInfo.aut_id"
              v-model="is_followed"
            ></FollowUser>
          </template>
        </van-cell>
        <!-- 文章内容 -->
        <div class="article-content">
          <div v-html="articleInfo.content" ref="article-content"></div>
          <van-divider>正文结束</van-divider>
        </div>
      </div>
    </div>

    <!-- 底部操作区，仅当文章加载完成时可用 -->
    <div class="footer-wrap" v-if="httpStatus === 200">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
      >写评论</van-button>
      <van-icon name="comment-o" badge="123" color="#777"/>
      <CollectArticle
        :articleId="articleId"
        v-model="articleInfo.is_collected"
      ></CollectArticle>
      <!-- <van-icon name="good-job-o" color="#777"/> -->
      <LikeArticleVue
        :articleId="articleId"
        v-model="articleInfo.attitude"
      ></LikeArticleVue>
      <van-icon name="share" color="#777"></van-icon>
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
// import JSONbig from 'json-bigint'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user/FollowUser.vue'
import CollectArticle from '@/components/collect-article/CollectArticle.vue'
import LikeArticleVue from '@/components/like-article/LikeArticle.vue'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticleVue
  },
  data () {
    return {
      articleInfo: {}, // 文章详情，所有文章信息都在里面
      isLoading: true, // 是否正在加载文章
      httpStatus: NaN, // 文章详情加载的HTTP状态码
      is_followed: false // 是否已关注该用户
    }
  },
  props: {
    // 使用组件props解耦路由参数
    articleId: {
      // 正常点击文章项ArticleItem，则可能是数字，也可能是字符串，取决于后台给的art_id
      // ArticleItem.vue已经预先处理了，因此这里只可能是字符串
      // 但是通过浏览器URL地址栏进入本路由，则必定是字符串
      // type: [Number, String],
      type: String,
      required: true
    }
  },
  methods: {
    // 加载文章详情
    async loadArticle () {
      this.articleInfo = {}
      this.isLoading = true
      this.httpStatus = NaN
      try {
        const res = await getArticleById(String(this.articleId))
        this.articleInfo = res?.data?.data || {}
        this.is_followed = this.articleInfo.is_followed
        console.log('ArticleIndex.vue已经获取到了文章详情')
        console.log(res)
        this.httpStatus = res.status || 200

        // 在下一次异步DOM更新后执行一些任务，这里获取<img>的src并加载ImagePreview图片预览组件
        await this.$nextTick()
        this.previewImages()
      } catch (e) {
        this.$toast('获取文章详情时发生了错误，请重试')
        console.log('ArticleIndex.vue在获取文章详情时发生了错误')
        console.log(e)
        this.httpStatus = e.response?.status || 404
      }
      this.isLoading = false
    },
    // 获取<img>的src并加载ImagePreview图片预览组件
    previewImages () {
      const oArticleContent = this.$refs['article-content']
      if (oArticleContent) {
        const oArticleContentImgList = oArticleContent.querySelectorAll('img')
        const images = []
        for (const oArticleContentImg of oArticleContentImgList) {
          if (oArticleContentImg.src) {
            images.push(oArticleContentImg.src) // 7682
          }
        }
        oArticleContentImgList.forEach((value, index) => {
          // 点击图片，以当前图片位置为起始，加载ImagePreview图片预览组件
          value.addEventListener('click', function () {
            ImagePreview({
              images, // 图片数组
              startPosition: index, // 指定初始显示的图片索引
              closeable: true, // 展示关闭按钮
              onClose () { // 图片预览组件关闭的事件处理函数
                this.$toast('图片预览组件已关闭')
              }
            })
          })
        })
      } else {
        console.warn('加载ImagePreview图片预览组件失败，未监测到文章内容')
      }
    }
    // 子组件FollowUser.vue的事件，修改'是否已关注该用户'状态
    /*
    changeIsFollowed () {
      this.is_followed = !this.is_followed
    }
    */
  },
  created () {
    console.log('ArticleIndex.vue使用组件props解耦路由参数，获得articleId =', this.articleId)
    this.loadArticle()
    /*
    console.log('json-bigint包提供的工具类如下：')
    console.log(JSONbig)

    const json = '{ "value": 9223372036854775807, "v2": 123 }'
    console.log('json: ', json)
    console.log('')

    const result = JSON.parse(json)
    console.log('1、使用JS原生内置对象JSON')
    console.log('JSON.parse(json) 的结果： ', result)
    console.log('JSON.stringify( JSON.parse(json) ) 的结果: ', JSON.stringify(result))

    const result2 = JSONbig.parse(json)
    console.log('2、使用json-bigint包提供的工具类')
    console.log('JSONbig.parse(json) 的结果： ', result2)
    const bigNumStr = result2.value.toString()
    console.log('获取 JSONbig.parse(json) 的结果中，value对应的字符串： ', bigNumStr)
    console.log('JSONbig.stringify( JSONbig.parse(json) ) 的结果： ', JSONbig.stringify(result2))
    */
  }
}
</script>

<style lang="scss" scoped>
.article-container {
  // 文章页面主体
  .main-wrap {
    position: fixed; // 占满视口所有的剩余空间，除了顶部导航栏与底部操作栏
    top: 92px;
    right: 0;
    bottom: 88px;
    left: 0;
    overflow: auto;
    background-color: #fff;

    // 加载中
    .loading-wrap {
      padding: 200px 32px;
      text-align: center;
    }

    // 加载失败：404
    .error-wrap {
      padding: 200px 32px;
      text-align: center;

      .van-icon {
        font-size: 122px;
        color: #b4b4b4;
      }
      .text {
        margin: 33px 0 46px;
        font-size: 30px;
        color: #666;
      }
    }

    // 加载完成，显示文章内容
    .article-detail {
      // 文章标题
      .article-title {
        padding: 50px 32px;
        font-size: 40px;
        color: #3a3a3a;
      }
      // 作者
      :deep(.user-info) {
        .van-cell__title {
          display: flex;
        }
        // 作者头像
        .avatar {
          width: 70px;
          height: 70px;
          margin-right: 20px;
        }
        // 作者信息
        .detail {
          font-size: 24px;
          color: #3a3a3a;
          line-height: 1.5;

          .user-info-publish-date {
            color: #aaa;
          }
        }
        // 关注按钮
        .van-button {
          height: 60px;
          border: 2px solid deepskyblue;
          background-color: rgb(8, 152, 241);
          color: #fff;
          transition: all 0.3s;

          &.followed {
            border: 2px solid #ddd;
            background-color: #fff;
            color: #333
          }
        }
      }
      // 文章内容
      .article-content {
        padding: 20px;
        font-size: 28px;
        color: #333;
        text-indent: 2em;

        :deep(h1.heading) {
          margin: 40px 0;
          font: 400 36px monospace;
        }
        :deep(h2) {
          margin: 30px 0;
          font: 400 32px monospace;
        }
        :deep(p) {
          font-size: 28px;
          text-indent: 2em;

          img {
            position: relative;
            left: calc(-2em);
            width: 100%;
          }
        }
        :deep(ul) {
          padding-left: 40px;
          margin: 20px 0;

          li {
            list-style-type: disc;
            font-size: 28px;
          }
        }
        :deep(pre) {
          overflow-x: scroll;
          padding: 20px;
          background-color: #f1f1f1;
        }
      }
    }
  }

  // 底部操作区
  .footer-wrap {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 88px;
    border-top: 1px solid #ddd;
    background-color: #fff;

    .comment-btn {
      width: 282px;
      height: 60px;
      font-size: 30px;
      color: #aaa;
    }
    :deep(.van-icon) {
      font-size: 40px;
    }
  }
}
</style>
