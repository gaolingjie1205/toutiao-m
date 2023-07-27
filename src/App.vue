<template>
  <div id="app">
<!--
    <h1>你好，黑马头条移动端项目！ </h1>
    <i class="toutiao toutiao-dianzan"></i>
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
    <div class="box">
      Hello World
    </div>
-->
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style lang="scss">
h1 {
  font-size: 20px;
}
.box {
  width: 555px;
  height: 64px;
  background-color: pink;
}
</style>
