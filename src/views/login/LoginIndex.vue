<template>
  <div class="login-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="请登录" />

    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <!-- name规定表单提交的对象属性名 -->
      <!-- type=digit规定本输入框只能输入整数，这其实是利用了HTML5中input的type属性，取值与原生HTML5完全一致 -->
      <!-- maxlength规定最多输入多少个字符 -->
      <!-- rules规定如何校验本输入框的值 -->
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        type="digit"
        maxlength="11"
        :rules="userFormRules.mobile"
      >
        <template #left-icon>
          <i class="toutiao toutiao-shouji"></i>
        </template>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        type="digit"
        maxlength="6"
        :rules="userFormRules.code"
      >
        <template #left-icon>
          <i class="toutiao toutiao-yanzhengma"></i>
        </template>
        <template #button>
          <!-- <van-count-down
            :time="time"
            format="ss s"
            v-show="isCountDownShow"
            @finish="isCountDownShow=false"
          /> -->
          <!-- native-type="button"表示这只是一个普通按钮，不能省略，否则就是提交按钮，发送验证码并不是要提交表单！ -->
          <van-button
            round
            size="small"
            class="btn-send-sms"
            @click="onSendSms()"
            native-type="button"
            ref="sendSmsBtn"
          >发送验证码
          </van-button>
        </template>
      </van-field>
      <div class="container-login-btn">
        <van-button round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>

    <!-- 提示信息，仅供学习使用！ -->
    <div class="login-tips">
      <p>测试手机号：13911111111</p>
      <p>测试验证码：246810</p>
    </div>
  </div>
</template>

<script>
import { login, getSmsCode } from '@/api/user'
export default {
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 短信验证码
      },
      userFormRules: { // 校验规则
        mobile: [ // 手机号校验规则，注意里面的校验规则自带顺序
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            required: true,
            message: '手机号格式错误'
          }
        ],
        code: [ // 短信验证码校验规则
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            required: true,
            message: '验证码格式错误'
          }
        ]
      },
      time: 60 * 1000, // 可再次发送短信验证码的倒计时
      isCountDownShow: false // 是否显示倒计时
    }
  },
  methods: {
    async onSubmit (values) {
      console.log('submit', values)
      // 1、通过values获取vant给开发者的表单数据对象
      // 2、使用regExp进行表单验证
      // 3、验证通过则提交表单请求登录
      // 4、根据服务器响应，做后续处理
      this.$toast.loading({ // 组件中可以用this.$toast来调用Toast接口
        message: '正在登录...',
        forbidClick: true,
        duration: 5000
      })
      try {
        const loginResult = await login(values)
        this.$toast.success('登录成功')
        console.log('LoginIndex.vue已经拿到了服务器返回的登录结果！')
        console.log(loginResult)
        // 不要直接在组件中修改state，要使用mutations来修改
        // 第一次直接写下面的代码，我的浏览器vue插件都追踪不到变化
        // this.$store.state.user = loginResult.data.data
        this.$store.commit('setUser', loginResult.data.data)
        console.log('LoginIndex.vue已经将顶层vuex模块的user更新为以下对象：')
        console.log(this.$store.state.user)
      } catch (e) {
        this.$toast.fail(`登录失败，${e?.response?.data?.message || '请检查您的网络连接'}`)
        console.log('LoginIndex.vue在发送登录信息时发生了错误！')
        console.log(e)
      }
    },
    async onSendSms () {
      // 1、校验手机号
      // 2、验证通过，则显示可再次发送验证码前的倒计时
      // 3、像黑马服务器发送请求，获取验证码
      try {
        const res = await this.$refs.loginForm.validate('mobile')
        console.log(res)
        if (res === undefined) {
          console.log('即将发送验证码...')
        }
      } catch (e) {
        this.$toast.fail('发送验证码失败')
        console.log(e)
        return e
      }

      this.isCountDownShow = true

      // 60s内每个手机号只能发送一次验证码
      let remainSeconds = 60
      this.$refs.sendSmsBtn.innerHTML = '60s'
      this.$refs.sendSmsBtn.disabled = true
      const timer = setInterval(() => {
        if (remainSeconds > 1) {
          this.$refs.sendSmsBtn.innerHTML = `${--remainSeconds}s`
        } else {
          this.$refs.sendSmsBtn.innerHTML = '发送验证码'
          this.$refs.sendSmsBtn.disabled = false
          clearInterval(timer)
        }
      }, 1000)

      // 发送短信验证码
      try {
        const res = await getSmsCode(this.user.mobile)
        console.log(res) // 这个res里其实没有验证码，拿着没什么用
        this.$toast('发送验证码成功，请查看手机')
      } catch (e) {
        console.log(e)

        this.$refs.sendSmsBtn.innerHTML = '发送验证码'
        this.$refs.sendSmsBtn.disabled = false
        clearInterval(timer) // 发送失败，结束倒计时

        if (e.response.status === 429) {
          this.$toast.fail('发送验证码失败，同一个手机号一分钟只能发送一条验证码')
        } else {
          this.$toast.fail('发送验证码失败')
        }
        return e
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 字体图标
.toutiao {
  position: relative;
  top: 2px;   // postcss-pxtorem会把px转换为rem，我这里无需手动计算
  font-size: 37px;
}
.btn-send-sms {
  // 发送验证码
  width: 160px;
  height: 46px;
  background-color: #eee !important;
  font-size: 22px;
  color: #666 !important;
  vertical-align: middle;
}
.container-login-btn {
  // 登录按钮容器
  padding: 53px 33px;

  .van-button {
    border: 0 !important;
    background-color: #6db4fb;
  }
}
// 提示信息，仅供学习使用！
.login-tips {
  font: 28px/1.5 monospace;
  color: #666;
  text-align: center;
}
</style>
