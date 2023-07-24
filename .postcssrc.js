/**
 * PostCSS 配置文件
 */

module.exports = {
  // 要使用哪些PostCSS插件，以及如何使用它们
  plugins: {
    // 自动添加浏览器兼容性CSS前缀，但是并不推荐这么做，因为vue默认就配置了autoprefixer，我这里又来配置一次，会与默认配置产生冲突，应该把本规则放在.browserlistrc或者package.json里面
    // 'autoprefixer': {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },

    // vant组件库要求以37.5px为单位进行转换，但是黑马的设计稿是750px的，且希望开发者不使用2x缩放，即量到多少就写多少像素单位，那就需要以75px为单位进行转换，因此这里对rootValue给出一个函数来分别处理
    // https://github.com/cuth/postcss-pxtorem
    'postcss-pxtorem': {
      rootValue({file}) {
        // console.log("postcss-pxtorem插件在转换px为rem单位时，接收到的input参数为：");
        // console.log(input);
        return file.indexOf("vant") !== -1 ? 37.5 : 75
      },
      propList: ['*']
    }
  }
}
